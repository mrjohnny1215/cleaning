import { useState } from 'react'
import { ArrowDown, ArrowRight, BadgeCheck, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Clock3, Droplets, Leaf, Menu, Minus, Phone, Plus, ShieldCheck, Sparkles, Star, Wrench, X } from 'lucide-react'

const products = [
  { id: 'wall', name: '벽걸이 에어컨', price: 80000, note: '원룸·작은 방' },
  { id: 'stand', name: '스탠드 에어컨', price: 140000, note: '가정용 기본형' },
  { id: 'two', name: '2in1 세트', price: 200000, note: '벽걸이 + 스탠드' },
  { id: 'ceiling', name: '천장형 시스템', price: 110000, note: '1way 기준' },
  { id: 'fridge', name: '냉장고 분해세척', price: 150000, note: '양문형 기준' },
]
const fmt = (n: number) => `${n.toLocaleString('ko-KR')}원`
const steps = [
  ['01', '작동 점검 & 환경 보양', '제품 상태를 확인하고 주변 가구와 바닥을 꼼꼼하게 보호해요.'],
  ['02', '제품 완전 분해', '전문 마스터가 구조에 맞춰 필요한 부품을 안전하게 분해해요.'],
  ['03', '친환경 약품 도포', '인체에 부담을 줄인 세정제를 오염 부위에 골고루 도포해요.'],
  ['04', '130bar 고압 스팀 세척', '눈에 보이지 않는 곰팡이와 묵은 먼지까지 시원하게 씻어내요.'],
  ['05', 'UV 살균 & 피톤치드', '살균 케어와 피톤치드로 한 번 더 쾌적하게 마무리해요.'],
  ['06', '조립 & 시운전', '처음처럼 조립한 뒤 작동 상태까지 확인하고 주변을 정리해요.'],
]
const reviews = [
  { name: '김** · 서울 마포구', date: '2025. 05. 12', text: '에어컨에서 꿉꿉한 냄새가 나서 신청했어요. 분해한 상태를 직접 보여주셔서 믿음이 갔고, 마무리까지 정말 깔끔했습니다!', tag: '벽걸이 에어컨' },
  { name: '박** · 경기 성남시', date: '2025. 05. 10', text: '아이 방 에어컨이라 걱정했는데 친환경 세제라고 설명해주셔서 안심했어요. 케어 후 공기가 확실히 달라졌네요.', tag: '스탠드 에어컨' },
  { name: '이** · 서울 송파구', date: '2025. 05. 08', text: '냉장고 안쪽 구석까지 스팀으로 세척해주셨어요. 친절하고 꼼꼼한 서비스 덕분에 기분 좋게 이용했습니다.', tag: '냉장고 케어' },
]

function App() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [visitDate, setVisitDate] = useState('')
  const [modal, setModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [slider, setSlider] = useState(50)
  const [activePair, setActivePair] = useState(0)
  const [mobileMenu, setMobileMenu] = useState(false)
  const total = products.reduce((sum, product) => sum + product.price * (counts[product.id] || 0), 0)
  const pairs = [
    { title: '에어컨 냉각핀 & 송풍팬', before: '곰팡이와 먼지가 쌓인 냉각핀', after: '고압 세척 후 깨끗해진 냉각핀', beforeImg: '/ac-before.webp', afterImg: '/ac-after.webp' },
    { title: '냉장고 선반 & 도어패킹', before: '구석구석 자리 잡은 오염과 곰팡이', after: '스팀 살균으로 반짝이는 내부', beforeImg: '/fridge-before.webp', afterImg: '/fridge-after.webp' },
  ]
  const current = pairs[activePair]
  const changeCount = (id: string, amount: number) => setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + amount) }))
  const openBooking = () => { setSubmitted(false); setModal(true) }
  const closeBooking = () => setModal(false)

  return <>
    <header className="header"><a className="brand" href="#top" aria-label="케어홈 홈"><span className="brand-mark"><Sparkles size={19} strokeWidth={2.5} /></span><span>케어홈<span className="brand-en">CARE HOME</span></span></a>
      <button className="mobile-menu-button" aria-label="메뉴 열기" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
      <nav className={mobileMenu ? 'nav nav-open' : 'nav'}><a href="#services" onClick={() => setMobileMenu(false)}>서비스 소개</a><a href="#before-after" onClick={() => setMobileMenu(false)}>작업 전후</a><a href="#reviews" onClick={() => setMobileMenu(false)}>이용 후기</a><a href="#guarantee" onClick={() => setMobileMenu(false)}>안심 보장</a></nav>
      <button className="header-cta" onClick={openBooking}>간편 예약 <ArrowRight size={16} /></button>
    </header>

    <main id="top">
      <section className="hero"><div className="hero-bg-grid" /><div className="hero-inner">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" />우리 집을 위한 프리미엄 홈케어</div>
          <h1>우리 집 가전,<br />새것처럼 <span>완벽하게</span><br className="mobile-break" /> 케어하세요!</h1>
          <p className="hero-desc">에어컨·냉장고 스팀 고온 살균부터 분해 청소까지,<br className="desktop-break" /> 안심 프리미엄 홈케어로 매일을 더 쾌적하게.</p>
          <div className="trust-row"><div><span className="trust-icon green"><Leaf size={17} /></span><span>친환경 세제 사용</span></div><div><span className="trust-icon blue"><ShieldCheck size={17} /></span><span>30일 무상 AS 보장</span></div><div><span className="trust-icon amber"><Wrench size={17} /></span><span>분해 전문 마스터</span></div></div>
        </div>
          <div className="hero-visual"><div className="hero-photo-wrap"><img className="hero-photo" src="/hero.webp" alt="전문 마스터가 에어컨을 스팀 세척하는 모습" /><div className="photo-tint" />
            <div className="photo-label"><span className="live-dot" /><span>오늘도 꼼꼼하게, 안심 케어</span></div><div className="photo-card"><span className="photo-card-icon"><CircleCheck size={19} /></span><span><b>만족도 99%</b><small>케어홈 고객 만족도</small></span><span className="photo-stars">★★★★★</span></div></div>
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        </div>
      </div>
      <div className="hero-bottom"><span><span className="hero-bottom-number">01</span> 깨끗한 공기, 건강한 하루</span><a href="#services">서비스 둘러보기 <ArrowDown size={15} /></a></div>
      </section>

      <section className="quote-section" id="services"><div className="section-shell quote-grid"><div className="quote-intro"><span className="section-kicker">EASY ESTIMATE</span><h2>우리 집 케어,<br /><span>얼마일까?</span></h2><p>필요한 가전을 선택하면 예상 비용을<br className="desktop-break" /> 바로 확인할 수 있어요.</p><div className="quote-note"><ShieldCheck size={17} /><span>추가 비용 걱정 없는 투명한 견적</span></div></div>
        <div className="quote-card"><div className="quote-card-header"><div><h3>간편 견적 계산기</h3><p>제품과 수량을 선택해주세요</p></div><span className="step-chip">STEP 01</span></div>
          <div className="product-list">{products.map((product) => <div className={counts[product.id] ? 'product-row selected' : 'product-row'} key={product.id}><div className="product-check">{counts[product.id] ? <Check size={13} /> : null}</div><div className="product-name"><b>{product.name}</b><small>{product.note}</small></div><b className="product-price">{fmt(product.price)}<small>~</small></b><div className="quantity"><button aria-label={`${product.name} 수량 감소`} onClick={() => changeCount(product.id, -1)} disabled={!counts[product.id]}><Minus size={13} /></button><span>{counts[product.id] || 0}</span><button aria-label={`${product.name} 수량 증가`} onClick={() => changeCount(product.id, 1)}><Plus size={13} /></button></div></div>)}</div>
          <label className="date-label" htmlFor="visit-date"><span>방문 희망 일정</span><span className="optional">선택 사항</span></label><div className="date-field"><CalendarDays size={17} /><input id="visit-date" type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} /><ChevronDown size={16} /></div>
          <div className="estimate-total"><span>예상 견적 <small>(부가세 포함)</small></span><strong>{fmt(total)}<small>~</small></strong></div><button className="primary-button estimate-button" onClick={openBooking}>3초 만에 예약 신청하기 <ArrowRight size={17} /></button><p className="quote-footnote"><ShieldCheck size={13} /> 일정 확정 후 최종 견적을 안내드려요</p>
        </div></div></section>

      <section className="before-section" id="before-after"><div className="section-shell"><div className="section-heading"><div><span className="section-kicker">REAL CHANGE</span><h2>달라진 공기를 <span>직접 확인하세요</span></h2><p>눈으로 확인할 수 있는 케어홈의 전후 차이</p></div><div className="pair-arrows"><button aria-label="이전 비교" onClick={() => { setActivePair((activePair + pairs.length - 1) % pairs.length); setSlider(50) }}><ChevronLeft /></button><span>0{activePair + 1} <i>/</i> 0{pairs.length}</span><button aria-label="다음 비교" onClick={() => { setActivePair((activePair + 1) % pairs.length); setSlider(50) }}><ChevronRight /></button></div></div>
          <div className="compare-layout"><div className="compare-copy"><span className="compare-small">BEFORE & AFTER</span><h3>{current.title}</h3><p>분해하지 않으면 보이지 않는 곳까지<br />전문 장비로 깨끗하게 케어합니다.</p><div className="compare-captions"><div><span className="caption-dot before-dot" /><span><b>BEFORE</b><small>{current.before}</small></span></div><div><span className="caption-dot after-dot" /><span><b>AFTER</b><small>{current.after}</small></span></div></div><span className="drag-hint"><ArrowRight size={14} /> 슬라이더를 움직여 비교해보세요</span></div>
            <div className="compare-frame"><img className="compare-after" src={current.afterImg} alt={current.after} /><div className="compare-before" style={{clipPath: `inset(0 ${100 - slider}% 0 0)`}}><img src={current.beforeImg} alt={current.before} /></div><span className="compare-tag tag-before">BEFORE</span><span className="compare-tag tag-after">AFTER</span><div className="slider-divider" style={{left: `${slider}%`}}><span><ChevronLeft size={14} /><ChevronRight size={14} /></span></div><input className="compare-range" aria-label="작업 전후 비교 슬라이더" type="range" min="5" max="95" value={slider} onChange={(e) => setSlider(Number(e.target.value))} /></div>
          </div></div></section>

      <section className="process-section"><div className="section-shell"><div className="center-heading"><span className="section-kicker">CARE PROCESS</span><h2>처음부터 끝까지 <span>꼼꼼하게</span></h2><p>케어홈 마스터의 전문적인 6단계 케어 프로세스</p></div><div className="process-grid">{steps.map(([number, title, desc], index) => <article className="process-card" key={number}><div className="process-top"><span className="process-number">{number}</span><span className="process-icon">{index === 0 ? <ShieldCheck /> : index === 1 ? <Wrench /> : index === 2 ? <Droplets /> : index === 3 ? <Sparkles /> : index === 4 ? <Leaf /> : <BadgeCheck />}</span></div><h3>{title}</h3><p>{desc}</p>{index < steps.length - 1 && <ArrowRight className="process-arrow" size={17} />}</article>)}</div></div></section>

      <section className="review-section" id="reviews"><div className="section-shell"><div className="review-heading"><div><span className="section-kicker">REAL REVIEWS</span><h2>먼저 경험한 분들의 <span>이야기</span></h2><p>케어홈과 함께한 고객님들의 솔직한 후기예요.</p></div><div className="rating-box"><div><Star size={18} fill="currentColor" /><b>4.9</b><span>/ 5.0</span></div><small>실제 이용 고객 평점</small><div className="rating-stars">★★★★★</div></div></div><div className="review-grid">{reviews.map((review) => <article className="review-card" key={review.name}><div className="review-card-top"><span className="review-tag">{review.tag}</span><div className="review-stars">★★★★★</div></div><p>“{review.text}”</p><div className="review-author"><span className="avatar">{review.name.slice(0, 1)}</span><span><b>{review.name}</b><small>{review.date}</small></span><BadgeCheck size={16} className="verified" /><small className="verified-text">이용 확인</small></div></article>)}</div></div></section>

      <section className="guarantee-section" id="guarantee"><div className="section-shell guarantee-inner"><div className="guarantee-icon"><ShieldCheck size={30} /></div><div><span className="section-kicker">CARE HOME PROMISE</span><h2>맡기는 순간부터, <span>안심이 되도록.</span></h2><p>케어홈은 서비스 품질과 고객님의 공간을 소중하게 지킵니다.</p></div><div className="guarantee-points"><span><CircleCheck size={17} /> 30일 무상 A/S 보장</span><span><CircleCheck size={17} /> 영업배상책임보험 가입</span><span><CircleCheck size={17} /> 검증된 전문 마스터</span></div></div></section>
    </main>

    <footer className="footer"><div className="section-shell"><div className="footer-top"><a className="brand footer-brand" href="#top"><span className="brand-mark"><Sparkles size={19} /></span><span>케어홈<span className="brand-en">CARE HOME</span></span></a><div className="footer-phone"><Phone size={19} /><span><small>케어홈 고객센터</small><b>1588-0000</b></span><span className="footer-hours">평일 09:00 – 18:00</span></div></div><div className="footer-info"><span>상호명: 케어홈</span><span>대표자: 홍길동</span><span>사업자등록번호: 123-45-67890</span><span>통신판매업 신고번호: 제2025-서울강남-0000호</span><span>주소: 서울특별시 강남구 테헤란로 123, 4층</span></div><div className="footer-bottom"><span>© 2025 CARE HOME. All rights reserved.</span><span className="insurance"><ShieldCheck size={14} /> 영업배상책임보험 1억 원 가입</span><div><a href="#top">이용약관</a><a href="#top">개인정보처리방침</a></div></div></div></footer>

    <div className="mobile-sticky"><a href="tel:1588-0000"><Phone size={18} /> 전화 상담</a><button onClick={openBooking}><span className="kakao-symbol">T</span> 카카오톡 1:1 상담</button></div>
    {modal && <div className="modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) closeBooking() }}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close" onClick={closeBooking} aria-label="닫기"><X size={20} /></button>{submitted ? <div className="success-state"><div className="success-icon"><Check size={26} /></div><span className="section-kicker">REQUEST COMPLETE</span><h2>예약 신청이 완료됐어요!</h2><p>담당자가 확인 후 빠르게 연락드릴게요.<br />케어홈을 찾아주셔서 감사합니다.</p><button className="primary-button" onClick={closeBooking}>확인 <ArrowRight size={16} /></button></div> : <><div className="modal-heading"><span className="section-kicker">QUICK BOOKING</span><h2 id="booking-title">간편 예약 신청</h2><p>정보를 남겨주시면 확인 후 연락드릴게요.</p></div><div className="modal-summary"><span>선택 제품 <b>{Object.values(counts).reduce((sum, count) => sum + count, 0)}개</b></span><strong>{fmt(total)}<small>~</small></strong></div><form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}><label>이름<input required placeholder="성함을 입력해주세요" /></label><label>연락처<input required type="tel" pattern="[0-9\-+ ]{9,15}" placeholder="010-0000-0000" /></label><label>거주 지역<input required placeholder="예: 서울시 마포구" /></label><label className="privacy-check"><input type="checkbox" required /><span>상담을 위한 개인정보 수집 및 이용에 동의합니다.</span></label><button className="primary-button modal-submit" type="submit">예약 신청 완료하기 <ArrowRight size={16} /></button></form></>}</section></div>}
  </>
}

export default App
