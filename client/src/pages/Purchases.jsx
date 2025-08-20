import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Purchases(){
  const [list, setList] = useState([])
  const [ref, setRef] = useState({ bases:[], types:[] })
  const [form, setForm] = useState({ base:'', equipmentType:'', quantity:0, purchasedAt:new Date().toISOString(), note:'' })

  useEffect(()=>{
    const loadRef = async () => {
      const [b, t] = await Promise.all([
        api.get('/api/bases'),
        api.get('/api/equipment-types')
      ])
      setRef({ bases: b.data, types: t.data })
    }
    loadRef(); refresh()
  }, [])

  const refresh = async () => {
    const { data } = await api.get('/api/purchases')
    setList(data)
  }

  const submit = async (e) => {
    e.preventDefault()
    await api.post('/api/purchases', form)
    setForm(f=>({ ...f, quantity:0, note:'' }))
    refresh()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Purchases</h1>
      <form onSubmit={submit} className="bg-white rounded-2xl p-4 shadow grid md:grid-cols-5 gap-3">
        <select className="border rounded-xl p-2" value={form.base} onChange={e=>setForm(f=>({...f, base:e.target.value}))}>
          <option value="">Base</option>
          {ref.bases.map(b=> <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <select className="border rounded-xl p-2" value={form.equipmentType} onChange={e=>setForm(f=>({...f, equipmentType:e.target.value}))}>
          <option value="">Equipment</option>
          {ref.types.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
        <input className="border rounded-xl p-2" type="number" placeholder="Qty" value={form.quantity} onChange={e=>setForm(f=>({...f, quantity:Number(e.target.value)}))} />
        <input className="border rounded-xl p-2" type="datetime-local" value={form.purchasedAt.slice(0,16)} onChange={e=>setForm(f=>({...f, purchasedAt:new Date(e.target.value).toISOString()}))} />
        <input className="border rounded-xl p-2 col-span-2 md:col-span-1" placeholder="Note" value={form.note} onChange={e=>setForm(f=>({...f, note:e.target.value}))} />
        <button className="rounded-xl bg-black text-white py-2">Add Purchase</button>
      </form>

      <div className="bg-white rounded-2xl p-4 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="p-2">Date</th><th className="p-2">Base</th><th className="p-2">Equipment</th><th className="p-2">Qty</th><th className="p-2">By</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item._id} className="border-t">
                <td className="p-2">{new Date(item.purchasedAt).toLocaleString()}</td>
                <td className="p-2">{item.base?.name}</td>
                <td className="p-2">{item.equipmentType?.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.createdBy?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
