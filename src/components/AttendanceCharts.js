"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AttendanceCharts({ data, donutData }) {
      // গড় হার বের করা
      const totalVal = donutData.reduce((acc, curr) => acc + curr.value, 0);
      const avgRate = totalVal > 0 ? ((donutData[0].value / totalVal) * 100).toFixed(1) : 0;

      return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>

                  {/* Comparison Bar Chart */}
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontSize: '13px', marginBottom: '20px', color: '#64748b', fontWeight: 'bold' }}>ATTENDANCE VS TOTAL CAPACITY</h4>
                        <div style={{ width: '100%', height: 250 }}>
                              <ResponsiveContainer>
                                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={-20}>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                          <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                          <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                          {/* টুলটিপে সব ডাটা দেখার জন্য */}
                                          <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                                          />
                                          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />

                                          {/* ১. পেছনের বার (Total) - এটি আগে লিখলে এটি নিচে পড়ে যায়, তাই এটি পরে লিখতে হবে অথবা present বার আগে লিখতে হবে */}
                                          <Bar
                                                dataKey="total"
                                                fill="#144a92"
                                                radius={[6, 6, 0, 0]}
                                                barSize={20}
                                                name="Total Students"
                                                isAnimationActive={false}
                                          />

                                          {/* ২. সামনের বার (Present) - এটি নীল বারের ঠিক মাঝখানে ভেসে থাকবে */}
                                          <Bar
                                                dataKey="present"
                                                fill="#10b981"
                                                radius={[4, 4, 0, 0]}
                                                barSize={20}
                                                name="Actual Present"
                                          />
                                    </BarChart>
                              </ResponsiveContainer>
                        </div>
                  </div>

                  {/* Donut Chart with Average Center Text */}
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative' }}>
                        <h4 style={{ fontSize: '13px', marginBottom: '10px', color: '#64748b', fontWeight: 'bold' }}>COURSE_SUCCESS_RATE</h4>
                        <div style={{ width: '100%', height: 250 }}>
                              <ResponsiveContainer>
                                    <PieChart>
                                          <Pie data={donutData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                                                {donutData.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                          </Pie>
                                          <Tooltip />
                                          <Legend verticalAlign="bottom" iconType="circle" />
                                    </PieChart>
                              </ResponsiveContainer>
                              {/* মাঝখানের পারসেন্টেজ টেক্সট */}
                              <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <h2 style={{ margin: 0, color: '#0f172a', fontWeight: '900', fontSize: '28px' }}>{avgRate}%</h2>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>AVG_RATE</p>
                              </div>
                        </div>
                  </div>

            </div>
      );
}