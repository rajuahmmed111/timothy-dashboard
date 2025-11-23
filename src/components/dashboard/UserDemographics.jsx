import React, { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { IoIosArrowDown } from 'react-icons/io'
import { useGetUserDemographicsQuery } from '../../redux/api/statistics/getuserDemographics'
import { countries } from '../../utils/countries'

export default function UserDemographics() {
  // Time filter like previously done
  const timeOptions = ['Today', 'This Week', 'This Month', 'This Year']
  const [selectedTime, setSelectedTime] = useState('This Year')
  const [isOpen, setIsOpen] = useState(false)
  const timeParamMap = {
    'Today': 'TODAY',
    'This Week': 'THIS_WEEK',
    'This Month': 'THIS_MONTH',
    'This Year': 'THIS_YEAR',
  }

  const [country, setCountry] = useState('All')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('All')
  const [profession, setProfession] = useState('')

  const genders = ['All', 'Male', 'Female', 'Other']

  // Fetch data
  const queryArgs = {
    timeRange: timeParamMap[selectedTime],
    ...(country && country !== 'All' ? { country: country.toLowerCase() } : {}),
    ...(age ? { age: Number(age) } : {}),
    ...(gender && gender !== 'All' ? { gender: gender.toLowerCase() } : {}),
    ...(profession ? { profession: profession.toLowerCase() } : {}),
  }
  const { data: apiData, isLoading, error } = useGetUserDemographicsQuery(queryArgs)

  const data = apiData?.data?.userMonthsData?.map((m) => ({
    name: m.month.substring(0, 3),
    users: m.userCount,
    partners: m.partnerCount,
  })) || []

  const totalUsers = apiData?.data?.totalUsers ?? 0
  const totalPartners = apiData?.data?.totalPartners ?? 0

  // Number formatting: plain numbers < 100k, compact >= 100k
  const formatNumberTick = (value) => {
    const abs = Math.abs(value)
    if (abs < 100_000) return new Intl.NumberFormat('en-US').format(value)
    return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
  }

  // Helpers to compute a "nice" Y-axis upper bound and step
  const getNiceMax = (n) => {
    if (!n || n <= 0) return 10
    const pow = Math.pow(10, Math.floor(Math.log10(n)))
    const normalized = n / pow
    let nice
    if (normalized <= 1) nice = 1
    else if (normalized <= 2) nice = 2
    else if (normalized <= 5) nice = 5
    else nice = 10
    return nice * pow
  }

  const getNiceStep = (n) => {
    const pow = Math.pow(10, Math.floor(Math.log10(n)))
    const normalized = n / pow
    let nice
    if (normalized <= 1) nice = 1
    else if (normalized <= 2) nice = 2
    else if (normalized <= 5) nice = 5
    else nice = 10
    return nice * pow
  }

  // Derive Y-axis domain and ticks from both series (users + partners)
  const yValues = data.flatMap(d => [d.users || 0, d.partners || 0])
  const maxY = yValues.length ? Math.max(...yValues) : 0
  const niceMax = Math.max(10, getNiceMax(maxY)) // or getNiceMax(maxY * 1.1) for 10% headroom
  const approxStep = niceMax / 5
  const step = Math.max(1, Math.floor(getNiceStep(approxStep)))
  const yTicks = Array.from({ length: Math.floor(niceMax / step) }, (_, i) => (i + 1) * step).filter(t => t <= niceMax)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const usersVal = payload.find(p => p.dataKey === 'users')?.value ?? 0
      const partnersVal = payload.find(p => p.dataKey === 'partners')?.value ?? 0
      return (
        <div className="bg-amber-100 text-gray-900 text-xs font-semibold px-2 py-1 rounded shadow">
          <div>{label}</div>
          <div>Users: {formatNumberTick(usersVal)}</div>
          <div>Partners: {formatNumberTick(partnersVal)}</div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow px-2 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 ml-2">User Demographics</h2>
        <div className="relative inline-block text-left">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border cursor-pointer"
          >
            {selectedTime}
            <IoIosArrowDown className="ml-1" size={12} />
          </div>
          {isOpen && (
            <div className="absolute z-10 mt-1 w-36 bg-white border rounded-md shadow-lg right-0">
              {timeOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => { setSelectedTime(option); setIsOpen(false) }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content: Chart + Right tabs */}
      <div className="grid grid-cols-12 gap-4 items-stretch">
        {/* Chart */}
        <div className="col-span-12 md:col-span-9">
          <div className="h-60 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb13a" />
                    <stop offset="100%" stopColor="#ff8a00" />
                  </linearGradient>
                  <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c3720b" />
                    <stop offset="100%" stopColor="#8a5408" />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="6 4" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatNumberTick}
                  allowDecimals={false}
                  domain={[0, niceMax]}
                  ticks={yTicks}
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />

                <Bar
                  dataKey="users"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={22}
                  background={{ fill: '#FFF2E0', radius: 6 }}
                />
                <Bar
                  dataKey="partners"
                  fill="url(#barGradient2)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right-side Tabs */}
        <div className="col-span-12 md:col-span-3 md:border-l md:pl-6 pl-0">
          <div className="space-y-3 md:space-y-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Country</div>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Age</div>
              <input
                type="number"
                min="0"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 21"
              />
            </div>
            <div>
              <div className="text-gray-500 mb-1">Profession</div>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Engineer"
              />
            </div>
            <div>
              <div className="text-gray-500 mb-1">Gender</div>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                {genders.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

