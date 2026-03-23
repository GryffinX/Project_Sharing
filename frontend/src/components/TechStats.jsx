import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function TechStats({ projects }) {
  const techMap = {};
  projects.forEach(p => {
    p.ingredients?.forEach(tech => {
      techMap[tech] = (techMap[tech] || 0) + 1;
    });
  });

  const data = Object.keys(techMap).map(name => ({
    name,
    value: techMap[name]
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185'];

  return (
    <div className="stats-box">
      <h4>Trending Technologies</h4>
      <div className="chart-wrapper" style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
