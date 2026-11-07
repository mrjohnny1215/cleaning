import { useMemo, useState } from 'react'
import { ArrowLeft, CalendarDays, Check, ChevronDown, Download, ExternalLink, FileText, Search, ShieldAlert, Trash2, X } from 'lucide-react'
import { Booking, BookingStatus, getBookings, removeBooking, setBookingStatus } from '../lib/bookings'

const statusText: Record<BookingStatus, string> = {
  new: '신규 접수',
  contacted: '연락 완료',
  completed: '케어 완료',
  cancelled: '취소',
}

const money = (value: number) => `${value.toLocaleString('ko-KR')}원`
const dateTime = (value: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

type Props = { onBack: () => void }

export default function AdminPanel({ onBack }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(getBookings)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Booking | null>(null)

  const visibleBookings = useMemo(() => {
    const query = search.trim().toLowerCase()
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const matchesQuery = !query || [booking.name, booking.phone, booking.region, ...booking.items.map((item) => item.name)].some((value) => value.toLowerCase().includes(query))
      return matchesStatus && matchesQuery
    })
  }, [bookings, search, statusFilter])

  const updateStatus = (id: string, status: BookingStatus) => setBookings(setBookingStatus(id, status))
  const deleteBooking = (id: string) => {
    if (!window.confirm('이 신청 내역을 삭제할까요? 삭제한 내역은 복구할 수 없습니다.')) return
    setBookings(removeBooking(id))
    if (selected?.id === id) setSelected(null)
  }
  const exportCSV = () => {
    const header = ['신청일시', '이름', '연락처', '거주 지역', '방문 희망일', '신청 제품', '예상 견적', '상태']
    const rows = visibleBookings.map((booking) => [
      dateTime(booking.createdAt), booking.name, booking.phone, booking.region, booking.visitDate || '',
      booking.items.map((item) => `${item.name} ${item.quantity}개`).join(' / '), String(booking.estimatedTotal), statusText[booking.status],
    ])
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n')
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `care-home-requests-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const newCount = bookings.filter((booking) => booking.status === 'new').length
  const contactedCount = bookings.filter((booking) => booking.status === 'contacted').length
  const completedCount = bookings.filter((booking) => booking.status === 'completed').length

  return <div className="admin-app">
    <header className="admin-header"><a className="brand" href="/" onClick={(event) => { event.preventDefault(); onBack() }}><span className="brand-mark"><FileText size={18} /></span><span>케어홈<span className="brand-en">ADMIN</span></span></a><div className="admin-header-right"><span className="admin-header-label">관리자 패널</span><button className="admin-back-button" onClick={onBack}><ArrowLeft size={15} /> 사이트로</button></div></header>
    <main className="admin-main"><div className="admin-page-heading"><div><span className="section-kicker">BOOKING MANAGEMENT</span><h1>예약 신청 내역</h1><p>접수된 신청을 확인하고 진행 상태를 관리할 수 있어요.</p></div><button className="admin-export" onClick={exportCSV} disabled={!visibleBookings.length}><Download size={16} /> CSV 내보내기</button></div>
      <div className="admin-storage-notice"><ShieldAlert size={18} /><p><b>브라우저 임시 저장 중</b><span>이 브라우저에서 등록한 내역만 보입니다. 방문자들의 신청을 함께 관리하려면 Supabase 연결이 필요해요.</span></p></div>
      <section className="admin-stats" aria-label="신청 현황"><article><span>전체 신청</span><b>{bookings.length}</b><small>저장된 신청 내역</small></article><article><span>신규 접수</span><b>{newCount}</b><small>확인이 필요한 신청</small></article><article><span>연락 완료</span><b>{contactedCount}</b><small>상담을 진행 중</small></article><article><span>케어 완료</span><b>{completedCount}</b><small>서비스 완료</small></article></section>
      <section className="admin-list-section"><div className="admin-list-heading"><div><h2>신청 목록 <span>{visibleBookings.length}</span></h2><p>최근 신청 순으로 표시됩니다.</p></div><div className="admin-filters"><label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="이름, 연락처, 지역 검색" /></label><label className="admin-status-filter"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">모든 상태</option><option value="new">신규 접수</option><option value="contacted">연락 완료</option><option value="completed">케어 완료</option><option value="cancelled">취소</option></select><ChevronDown size={14} /></label></div></div>
        {visibleBookings.length ? <div className="admin-booking-list">{visibleBookings.map((booking) => <article className="admin-booking-card" key={booking.id}><div className="admin-booking-main"><div className="admin-booking-meta"><span className={`admin-status-pill status-${booking.status}`}>{statusText[booking.status]}</span><time>{dateTime(booking.createdAt)}</time></div><div className="admin-customer"><h3>{booking.name}</h3><a href={`tel:${booking.phone.replace(/[^0-9+]/g, '')}`}>{booking.phone}</a><span>{booking.region}</span></div><div className="admin-booking-items"><b>{booking.items.map((item) => `${item.name} ${item.quantity}개`).join(' · ') || '선택 제품 없음'}</b><span><CalendarDays size={14} /> 방문 희망일 {booking.visitDate || '미정'}</span></div></div><div className="admin-booking-side"><strong>{money(booking.estimatedTotal)}<small>~</small></strong><label className={`admin-status-select status-${booking.status}`}><select aria-label={`${booking.name} 신청 상태 변경`} value={booking.status} onChange={(event) => updateStatus(booking.id, event.target.value as BookingStatus)}><option value="new">신규 접수</option><option value="contacted">연락 완료</option><option value="completed">케어 완료</option><option value="cancelled">취소</option></select><ChevronDown size={13} /></label><div className="admin-row-actions"><button onClick={() => setSelected(booking)}><ExternalLink size={14} /> 상세</button><button className="admin-delete-button" onClick={() => deleteBooking(booking.id)} aria-label={`${booking.name} 신청 삭제`}><Trash2 size={15} /></button></div></div></article>)}</div> : <div className="admin-empty"><span><FileText size={25} /></span><h3>{bookings.length ? '검색 결과가 없어요' : '아직 접수된 신청이 없어요'}</h3><p>{bookings.length ? '검색어나 상태 조건을 바꿔보세요.' : '예약 폼을 테스트 제출하면 이 브라우저의 신청 내역이 여기에 표시됩니다.'}</p></div>}
      </section>
      <p className="admin-footnote"><Check size={14} /> 상태 변경과 삭제는 이 브라우저에 저장됩니다.</p>
    </main>
    {selected && <div className="modal-backdrop admin-detail-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null) }}><section className="admin-detail-modal" role="dialog" aria-modal="true" aria-labelledby="admin-detail-title"><button className="modal-close" onClick={() => setSelected(null)} aria-label="상세 닫기"><X size={19} /></button><span className="section-kicker">REQUEST DETAILS</span><h2 id="admin-detail-title">신청 상세 정보</h2><div className="admin-detail-status"><span className={`admin-status-pill status-${selected.status}`}>{statusText[selected.status]}</span><time>{dateTime(selected.createdAt)}</time></div><dl className="admin-detail-grid"><div><dt>이름</dt><dd>{selected.name}</dd></div><div><dt>연락처</dt><dd><a href={`tel:${selected.phone.replace(/[^0-9+]/g, '')}`}>{selected.phone}</a></dd></div><div><dt>거주 지역</dt><dd>{selected.region}</dd></div><div><dt>방문 희망일</dt><dd>{selected.visitDate || '미정'}</dd></div></dl><div className="admin-detail-products"><h3>신청 제품</h3>{selected.items.map((item) => <div key={item.productId}><span>{item.name} <small>× {item.quantity}</small></span><b>{money(item.unitPrice * item.quantity)}</b></div>)}<div className="admin-detail-total"><span>예상 견적</span><b>{money(selected.estimatedTotal)}~</b></div></div><div className="admin-detail-id">접수 번호 <code>{selected.id}</code></div><button className="primary-button admin-detail-close" onClick={() => setSelected(null)}>확인 <Check size={16} /></button></section></div>}
  </div>
}
