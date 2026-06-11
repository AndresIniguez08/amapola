import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/supabase";
import AdminLayout from "./AdminLayout";

const fmt = (amount) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount);

const PERIODS = [
  { key: "hoy", label: "Hoy" },
  { key: "semana", label: "Esta semana" },
  { key: "mes", label: "Este mes" },
  { key: "todo", label: "Todo" },
];

function getPeriodStart(period) {
  const now = new Date();
  if (period === "hoy") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "semana") {
    const day = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
  if (period === "mes") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null;
}

function groupByDay(orders) {
  const map = {};
  orders.forEach((o) => {
    const key = new Date(o.created_at).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
    });
    map[key] = (map[key] || 0) + o.total;
  });
  return Object.entries(map).map(([fecha, total]) => ({ fecha, total }));
}

function groupByHour(orders) {
  const map = {};
  orders.forEach((o) => {
    const h = new Date(o.created_at).getHours();
    const key = `${h}:00`;
    map[key] = (map[key] || 0) + o.total;
  });
  return Object.entries(map)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([hora, total]) => ({ hora, total }));
}

function MetricCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <p className="text-xs text-stone-400 mb-1.5">{label}</p>
      <p
        className={`text-2xl font-bold ${accent ? "text-yellow-600" : "text-[#7C5CBF]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SkeletonBlock({ className }) {
  return (
    <div className={`bg-stone-100 rounded-2xl animate-pulse ${className}`} />
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("semana");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: ordersData }, { data: productsData }] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("products").select("id, name, price, cost"),
      ]);
      setOrders(ordersData ?? []);
      setProducts(productsData ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const start = getPeriodStart(period);
    const active = orders.filter((o) => o.status !== "cancelado");
    if (!start) return active;
    return active.filter((o) => new Date(o.created_at) >= start);
  }, [orders, period]);

  const metrics = useMemo(() => {
    const totalVentas = filtered.reduce((s, o) => s + o.total, 0);
    const cantidad = filtered.length;
    const ticketPromedio = cantidad > 0 ? totalVentas / cantidad : 0;
    const pendientes = filtered.filter((o) => o.status === "pendiente").length;

    const productMap = {};
    products.forEach((p) => {
      productMap[p.id] = p;
    });

    let totalCostos = 0;
    filtered.forEach((o) => {
      (o.items ?? []).forEach((item) => {
        if (item.cost && item.cost > 0) {
          totalCostos += item.cost * item.quantity;
        } else {
          const prod = productMap[item.id];
          if (prod && prod.cost > 0) {
            totalCostos += prod.cost * item.quantity;
          }
        }
      });
    });

    const gananciaNeta = totalVentas - totalCostos;

    return {
      totalVentas,
      cantidad,
      ticketPromedio,
      pendientes,
      totalCostos,
      gananciaNeta,
    };
  }, [filtered, products]);

  const chartData = useMemo(() => {
    return period === "hoy" ? groupByHour(filtered) : groupByDay(filtered);
  }, [filtered, period]);

  const topProducts = useMemo(() => {
    const map = {};
    filtered.forEach((o) => {
      (o.items ?? []).forEach((item) => {
        const key = item.variant_name ? `${item.name} — ${item.variant_name}` : item.name;
        if (!map[key]) map[key] = { name: key, qty: 0, revenue: 0 };
        map[key].qty += item.quantity;
        map[key].revenue += item.subtotal;
      });
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [filtered]);

  const profitability = useMemo(() => {
    const productMap = {};
    products.forEach((p) => {
      productMap[p.id] = p;
    });
    const map = {};
    filtered.forEach((o) => {
      (o.items ?? []).forEach((item) => {
        const effectiveCost = item.cost > 0 ? item.cost : (productMap[item.id]?.cost ?? 0);
        if (!effectiveCost || effectiveCost <= 0) return;
        const key = item.variant_name ? `${item.name} — ${item.variant_name}` : item.name;
        if (!map[key]) {
          map[key] = {
            name: key,
            price: item.price,
            cost: effectiveCost,
            qty: 0,
            revenue: 0,
          };
        }
        map[key].qty += item.quantity;
        map[key].revenue += item.subtotal;
      });
    });
    return Object.values(map)
      .map((p) => ({
        ...p,
        margin: p.price > 0 ? ((p.price - p.cost) / p.price) * 100 : 0,
        ganancia: (p.price - p.cost) * p.qty,
      }))
      .sort((a, b) => b.margin - a.margin);
  }, [filtered, products]);

  const hasAnyCost = products.some((p) => p.cost > 0);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const STATUS_BADGE = {
    pendiente: "bg-yellow-100 text-yellow-700",
    confirmado: "bg-[#F3EEFF] text-[#7C5CBF]",
    entregado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
          <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  period === p.key
                    ? "bg-white text-[#7C5CBF] shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonBlock key={i} className="h-24" />
              ))}
            </div>
            <SkeletonBlock className="h-56" />
            <SkeletonBlock className="h-40" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total ventas"
                value={fmt(metrics.totalVentas)}
              />
              <MetricCard label="Pedidos" value={metrics.cantidad} />
              <MetricCard
                label="Ticket promedio"
                value={fmt(metrics.ticketPromedio)}
              />
              <MetricCard
                label="Pendientes"
                value={metrics.pendientes}
                accent
              />
            </div>

            {hasAnyCost && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                  <p className="text-xs text-stone-400 mb-1.5">
                    Ventas totales
                  </p>
                  <p className="text-2xl font-bold text-[#7C5CBF]">
                    {fmt(metrics.totalVentas)}
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                  <p className="text-xs text-stone-400 mb-1.5">
                    Costos totales
                  </p>
                  <p className="text-2xl font-bold text-stone-600">
                    {fmt(metrics.totalCostos)}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Solo productos con costo cargado
                  </p>
                </div>
                <div
                  className={`bg-white rounded-2xl border shadow-sm p-5 ${metrics.gananciaNeta >= 0 ? "border-green-100" : "border-red-100"}`}
                >
                  <p className="text-xs text-stone-400 mb-1.5">
                    Ganancia neta estimada
                  </p>
                  <p
                    className={`text-2xl font-bold ${metrics.gananciaNeta >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    {fmt(metrics.gananciaNeta)}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Ventas − costos</p>
                </div>
              </div>
            )}

            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-stone-700 mb-4">
                  Ventas por {period === "hoy" ? "hora" : "día"}
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey={period === "hoy" ? "hora" : "fecha"}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      width={40}
                    />
                    <Tooltip formatter={(v) => [fmt(v), "Ventas"]} />
                    <Bar dataKey="total" fill="#7C5CBF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {topProducts.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-stone-700 mb-4">
                  Productos más vendidos
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-stone-400 border-b border-stone-100">
                        <th className="pb-2 font-semibold">Producto</th>
                        <th className="pb-2 font-semibold text-right">Cant.</th>
                        <th className="pb-2 font-semibold text-right">
                          Ingresos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((p) => (
                        <tr
                          key={p.name}
                          className="border-b border-stone-50 last:border-0"
                        >
                          <td className="py-2 text-stone-800">{p.name}</td>
                          <td className="py-2 text-right text-stone-500">
                            {p.qty}
                          </td>
                          <td className="py-2 text-right font-semibold text-[#7C5CBF]">
                            {fmt(p.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-stone-700 mb-4">
                Rentabilidad por producto
              </h2>
              {!hasAnyCost ? (
                <p className="text-sm text-stone-400 text-center py-4">
                  Cargá el costo de tus productos para ver la rentabilidad
                  estimada.
                </p>
              ) : profitability.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-4">
                  No hay datos de rentabilidad para este período.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-stone-400 border-b border-stone-100">
                        <th className="pb-2 font-semibold">Producto</th>
                        <th className="pb-2 font-semibold text-right">
                          Precio
                        </th>
                        <th className="pb-2 font-semibold text-right">Costo</th>
                        <th className="pb-2 font-semibold text-right">
                          Margen
                        </th>
                        <th className="pb-2 font-semibold text-right">
                          Ganancia est.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitability.map((p) => (
                        <tr
                          key={p.name}
                          className="border-b border-stone-50 last:border-0"
                        >
                          <td className="py-2 text-stone-800">{p.name}</td>
                          <td className="py-2 text-right text-stone-500">
                            {fmt(p.price)}
                          </td>
                          <td className="py-2 text-right text-stone-500">
                            {fmt(p.cost)}
                          </td>
                          <td className="py-2 text-right font-semibold text-green-600">
                            {p.margin.toFixed(1)}%
                          </td>
                          <td className="py-2 text-right font-semibold text-[#7C5CBF]">
                            {fmt(p.ganancia)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {recentOrders.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-stone-700 mb-4">
                  Pedidos recientes
                </h2>
                <div className="space-y-0">
                  {recentOrders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-800">
                          {o.customer_name}
                        </p>
                        <p className="text-xs text-stone-400">
                          {new Date(o.created_at).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-[#7C5CBF] text-sm">
                          {fmt(o.total)}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[o.status] ?? "bg-stone-100 text-stone-500"}`}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
