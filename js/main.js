const storageKey = 'nha-bong-demo-v2';
const seedPets = [
  { id: 'bap', name: 'Bắp', kind: 'dog', breed: 'Corgi', age: '3 tháng', sex: 'Bé trai', price: 8500000, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=82', description: 'Bắp vui vẻ, thích chạy theo bóng và đã quen sinh hoạt cùng gia đình. Bé đã được kiểm tra sức khỏe định kỳ.', health: 'Đã kiểm tra sức khỏe', phone: '0901234567', sellerName: 'Nhà Bông', sellerType: 'store', status: 'live', active: true },
  { id: 'mo', name: 'Mơ', kind: 'cat', breed: 'Mèo mướp', age: '2 tháng', sex: 'Bé gái', price: 3200000, image: 'assets/meo-cu.jpg', description: 'Mơ thích ngủ nướng, hiền và quấn người. Bé đang ăn hạt dành cho mèo con.', health: 'Đã kiểm tra sức khỏe', phone: '0901234567', sellerName: 'Nhà Bông', sellerType: 'store', status: 'live', active: true },
  { id: 'dau', name: 'Đậu', kind: 'small', breed: 'Thỏ lùn', age: '2 tháng', sex: 'Bé trai', price: 1800000, image: 'https://images.unsplash.com/photo-1589933767411-38a58367efd7?auto=format&fit=crop&w=800&q=82', description: 'Đậu hiền, quen ăn cỏ khô và rau xanh. Bé cần không gian sạch và yên tĩnh.', health: 'Đã kiểm tra sức khỏe', phone: '0901234567', sellerName: 'Nhà Bông', sellerType: 'store', status: 'live', active: true },
  { id: 'bong', name: 'Bông', kind: 'dog', breed: 'Poodle', age: '4 tháng', sex: 'Bé gái', price: 6900000, image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=800&q=82', description: 'Bông thân thiện, thích được vuốt ve và đã làm quen với dây dắt.', health: 'Đã kiểm tra sức khỏe', phone: '0901234567', sellerName: 'Nhà Bông', sellerType: 'store', status: 'live', active: true },
  { id: 'tieu', name: 'Tiêu', kind: 'cat', breed: 'Mèo Anh lông ngắn', age: '3 tháng', sex: 'Bé trai', price: 5500000, image: 'assets/mydieu.jpg', description: 'Tiêu tò mò và thích ngắm mọi thứ bên cửa sổ. Bé đã được làm quen với khay cát.', health: 'Đã kiểm tra sức khỏe', phone: '0901234567', sellerName: 'Nhà Bông', sellerType: 'store', status: 'live', active: true },
  { id: 'ysitomimi-bimbimbambam', name: 'Ysitomimi BimBimBamBam', kind: 'cat', breed: 'Mèo mướp', age: '2 tháng', sex: 'Bé trai', price: 20000, image: 'assets/22ee923f-e19e-4a82-8d0e-6d4e9ce7a0c2.jpg', description: 'Bé hơi xấu tính, cần người kiên nhẫn làm quen và chăm sóc.', health: 'Chưa cập nhật', phone: '0901234567', sellerName: 'Nhà Bông', sellerType: 'store', status: 'live', active: true },
  { id: 'com', name: 'Cốm', kind: 'bird', breed: 'Vẹt yến phụng', age: '5 tháng', sex: 'Bé trai', price: 950000, image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=82', description: 'Cốm líu lo vào mỗi buổi sáng, ăn cám và hạt dành riêng cho vẹt nhỏ.', health: 'Được theo dõi tại cửa hàng', phone: '0901234567', sellerName: 'Nhà Bông', sellerType: 'store', status: 'live', active: true },
];
const kindNames = { dog: 'Chó', cat: 'Mèo', small: 'Thú nhỏ', bird: 'Chim' };
const statusNames = { pending: 'Chờ duyệt', live: 'Đang bán', sold: 'Đã tìm thấy nhà', adopted: 'Đã tìm thấy nhà', rejected: 'Bị từ chối' };
const app = document.querySelector('main');
const toast = document.querySelector('.toast');
let toastTimer;
let authMode = 'login';
let returnTo = '#home';
let pendingPurchaseId = null;
let state = loadState();
state.pets = state.pets.map((pet) => {
  const seed = seedPets.find((item) => item.id === pet.id);
  return seed ? { ...pet, image: seed.image } : pet;
});
const newSeedPet = seedPets.find((pet) => pet.id === 'ysitomimi-bimbimbambam');
if (newSeedPet) {
  const savedListing = state.listings.find((pet) => pet.name === newSeedPet.name);
  let stateChanged = false;
  if (savedListing) {
    if (savedListing.kind !== 'cat') {
      savedListing.kind = 'cat';
      stateChanged = true;
    }
    const savedPetCount = state.pets.length;
    state.pets = state.pets.filter((pet) => pet.id !== newSeedPet.id);
    stateChanged ||= state.pets.length !== savedPetCount;
  } else if (!state.pets.some((pet) => pet.id === newSeedPet.id)) {
    state.pets.push(newSeedPet);
  }
  if (stateChanged) saveState();
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && saved.version === 2) return saved;
  } catch (error) {
    console.warn('Không thể đọc dữ liệu demo:', error);
  }
  return {
    version: 2,
    users: [{ id: 'admin', name: 'Quản trị Nhà Bông', email: 'admin@nhabong.vn', password: 'nhabong123', phone: '0901234567', role: 'admin' }],
    currentUserId: null,
    pets: seedPets,
    listings: [],
    orders: [],
    cart: [],
    favorites: [],
    messages: [],
  };
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    showToast('Bộ nhớ trình duyệt đã đầy. Hãy thử ảnh nhỏ hơn.');
  }
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function money(value) {
  return `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)} ₫`;
}

function currentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function isAdmin() {
  return currentUser()?.role === 'admin';
}

function allPets() {
  return [...state.pets.filter((pet) => pet.active !== false), ...state.listings.filter((listing) => listing.status === 'live')]
    .sort((first, second) => (Date.parse(second.approvedAt || second.createdAt || '') || 0) - (Date.parse(first.approvedAt || first.createdAt || '') || 0));
}

function getPet(id) {
  return [...state.pets, ...state.listings].find((pet) => pet.id === id);
}

function routeParts() {
  return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function routeLink(route, label, className = '') {
  return `<a class="${className}" href="#${route}">${label}</a>`;
}

function updateHeader() {
  const nav = document.querySelector('#main-nav');
  const user = currentUser();
  const links = [
    ['home', 'Trang chủ'], ['about', 'Giới thiệu'], ['catalog', 'Thú cưng'],
    ['sell', 'Đăng tin'],
  ];
  if (user) links.push(['my-listings', 'Tin của tôi']);
  if (isAdmin()) links.push(['admin-pets', 'Duyệt tin']);
  links.push(['contact', 'Liên hệ'], ['account', 'Tài khoản']);
  nav.innerHTML = links.map(([route, label]) => routeLink(route, label, location.hash === `#${route}` ? 'is-current' : '')).join('');
  const cartTotal = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('.cart-count').textContent = cartTotal;
  document.querySelector('.cart-trigger').setAttribute('aria-label', `Giỏ hàng, ${cartTotal} sản phẩm`);
}

function petCard(pet) {
  const isStore = pet.sellerType === 'store';
  const isFavorite = state.favorites.includes(pet.id);
  const action = isStore
    ? `<button class="add-button" type="button" data-action="add-cart" data-id="${escapeHTML(pet.id)}" aria-label="Thêm ${escapeHTML(pet.name)} vào giỏ">+</button>`
    : `<a class="seller-link" href="tel:${escapeHTML(pet.phone || '')}" aria-label="Gọi người bán ${escapeHTML(pet.name)}">Liên hệ</a>`;
  return `<article class="pet-card">
    <a class="pet-image" href="#pet/${encodeURIComponent(pet.id)}"><img src="${escapeHTML(pet.image)}" alt="${escapeHTML(pet.name)}, ${escapeHTML(pet.breed)}" loading="lazy"><span class="pet-tag">${escapeHTML(kindNames[pet.kind] || 'Thú cưng')}</span></a>
    <button class="favorite-button" type="button" data-action="favorite" data-id="${escapeHTML(pet.id)}" aria-label="${isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'} ${escapeHTML(pet.name)}" aria-pressed="${isFavorite}">${isFavorite ? '♥' : '♡'}</button>
    <div class="pet-info"><div class="pet-title"><h3>${routeLink(`pet/${encodeURIComponent(pet.id)}`, escapeHTML(pet.name))}</h3><span class="pet-age">${escapeHTML(pet.age)}</span></div>
      <p class="pet-breed">${escapeHTML(pet.breed)} · ${escapeHTML(pet.sex || '')}</p>
      <div class="pet-card-bottom"><strong class="pet-price">${money(pet.price)}</strong>${action}</div>
      ${!isStore ? `<p class="seller-note">Người bán: ${escapeHTML(pet.sellerName || 'Thành viên')}</p>` : ''}
    </div>
  </article>`;
}

function renderHome() {
  const featured = allPets().slice(0, 3);
  return `<section class="hero" id="home"><div class="hero-copy"><p class="eyebrow"><span class="eyebrow-dot"></span> Từ chiếc mũi ươn ướt, gửi bạn chút yêu thương</p>
    <h1>Một người bạn nhỏ,<br>một <span>nhà đầy vui.</span></h1><p class="hero-description">Gặp những người bạn được chăm sóc kỹ càng, hoặc tìm hiểu cách đăng tin cho bé cưng của bạn.</p>
    <div class="hero-actions">${routeLink('catalog', 'Khám phá thú cưng ↗', 'button button-primary')}${routeLink('about', 'Tìm hiểu Nhà Bông →', 'text-link')}</div>
    <div class="hero-note"><strong>Hơn 320 bé</strong> đã tìm được mái nhà ấm áp</div></div>
    <div class="hero-visual"><div class="hero-photo-wrap"><img class="hero-photo" src="${escapeHTML(featured[0]?.image || '')}" alt="Một người bạn nhỏ đang đợi gia đình" fetchpriority="high"></div><span class="photo-caption">Bắt đầu từ một lần gặp gỡ</span></div></section>
    <section class="promise-strip"><div><span class="promise-icon icon-peach">♡</span><span><strong>Thông tin rõ ràng</strong><small>Người bán và tình trạng tin</small></span></div><div><span class="promise-icon icon-green">✿</span><span><strong>Được chăm chút</strong><small>Đồng hành trước khi đón bé</small></span></div><div><span class="promise-icon icon-yellow">⌂</span><span><strong>Gặp đúng người</strong><small>Liên hệ trực tiếp người bán</small></span></div></section>
    <section class="pets-section"><div class="section-heading"><div><p class="eyebrow">Tin vừa được duyệt</p><h2>Tin mới <span>gần đây</span></h2></div>${routeLink('catalog', 'Xem tất cả →', 'text-link')}</div><div class="pet-grid">${featured.map(petCard).join('')}</div><div class="more-pets">${routeLink('catalog', 'Xem thêm →', 'button button-primary')}</div></section>
    <section class="adoption-banner"><div class="banner-copy"><p class="eyebrow">Góc của người bán</p><h2>Bé cưng cần một mái nhà<br>thật hợp?</h2><p>Tạo tin miễn phí, bổ sung ảnh và thông tin chăm sóc. Tin sẽ được duyệt trước khi xuất hiện công khai.</p></div>${routeLink('sell', 'Đăng tin cho bé ↗', 'button button-light')}</section>`;
}

function renderAbout() {
  return `<section class="page-section"><p class="eyebrow">Một tiệm nhỏ nhiều thương yêu</p><h1>Về <span>Nhà Bông</span></h1><p class="lead">Nhà Bông là nơi những người yêu thú cưng gặp gỡ, chia sẻ và tìm một người bạn nhỏ phù hợp để cùng chăm sóc mỗi ngày.</p>
    <div class="about-story"><img src="assets/0bd6d4ca-4046-4314-a155-7d3e9875d76a.jpg" alt="Mèo con đang ngước nhìn"><div><p class="eyebrow">Câu chuyện Nhà Bông</p><h2>Mỗi bé đều xứng đáng có một mái nhà ấm áp.</h2><p>Tụi mình tin rằng sự gắn bó bắt đầu từ việc hiểu tính cách, nhu cầu và câu chuyện riêng của từng bé. Nhà Bông mong muốn giúp các gia đình tìm thấy người bạn đồng hành phù hợp.</p></div></div>
    <div class="about-grid"><article><span class="promise-icon icon-peach">♡</span><h2>Chăm sóc tử tế</h2><p>Thông tin sức khỏe và nhu cầu chăm sóc được chia sẻ rõ ràng để gia đình mới chuẩn bị tốt hơn.</p></article><article><span class="promise-icon icon-green">✿</span><h2>Duyệt tin trước</h2><p>Tin do thành viên đăng ở trạng thái chờ duyệt. Chỉ tin được quản trị viên thông qua mới hiển thị công khai.</p></article><article><span class="promise-icon icon-yellow">⌂</span><h2>Luôn đồng hành</h2><p>Tụi mình sẵn lòng tư vấn về việc chuẩn bị nhà cửa, chế độ ăn và những ngày đầu đón bé.</p></article></div>
    <div class="contact-band"><div><p class="eyebrow">Ghé thăm tụi mình</p><h2>Tiệm Nhà Bông</h2><p>28 Nguyễn Văn Thương, Bình Thạnh, TP. Hồ Chí Minh</p><p>Thứ Hai – Chủ Nhật · 09:00 – 20:00</p></div><div><p><strong>Điện thoại</strong><br><a href="tel:0901234567">090 123 4567</a></p><p><strong>Email</strong><br><a href="mailto:hello@nhabong.vn">hello@nhabong.vn</a></p>${routeLink('contact', 'Gửi lời nhắn →', 'text-link')}</div></div></section>`;
}

function renderCatalog() {
  const pets = allPets();
  return `<section class="page-section"><p class="eyebrow">Tìm người bạn hợp với nhà mình</p><h1>Các bé <span>đang tìm nhà</span></h1><div class="catalog-toolbar"><label class="search-box"><span>⌕</span><input id="catalog-search" type="search" placeholder="Tên hoặc giống..." aria-label="Tìm tên hoặc giống"></label><label>Loài<select id="catalog-kind"><option value="all">Tất cả</option>${Object.entries(kindNames).map(([key, label]) => `<option value="${key}">${label}</option>`).join('')}</select></label><label>Giá từ<input id="catalog-min" type="number" min="0" step="100000" placeholder="0"></label><label>Đến<input id="catalog-max" type="number" min="0" step="100000" placeholder="Không giới hạn"></label><label>Sắp xếp<select id="catalog-sort"><option value="new">Mặc định</option><option value="low">Giá thấp trước</option><option value="high">Giá cao trước</option></select></label></div>
    <div class="catalog-result"><span id="catalog-count">${pets.length} bé</span><span>Tin thành viên chỉ liên hệ trực tiếp, không thanh toán qua giỏ hàng.</span></div><div class="pet-grid" id="catalog-grid">${pets.map(petCard).join('')}</div><p class="empty-state" id="catalog-empty" hidden>Chưa có bé phù hợp. Hãy thử nới khoảng giá hoặc đổi bộ lọc.</p></section>`;
}

function renderPetDetail(id) {
  const pet = getPet(decodeURIComponent(id || ''));
  if (!pet || pet.active === false || (pet.sellerType !== 'store' && pet.status !== 'live')) return `<section class="page-section"><h1>Không tìm thấy bé này</h1>${routeLink('catalog', 'Quay lại danh sách →', 'button button-primary')}</section>`;
  const isStore = pet.sellerType === 'store';
  const contact = isStore ? `<button class="button button-primary" data-action="add-cart" data-id="${escapeHTML(pet.id)}">Thêm vào giỏ hàng · ${money(pet.price)}</button>` : `<a class="button button-primary" href="tel:${escapeHTML(pet.phone || '')}">Gọi người bán · ${escapeHTML(pet.phone || 'Chưa cập nhật')}</a>`;
  return `<section class="page-section"><p class="eyebrow">${routeLink('catalog', '← Danh sách thú cưng')}</p><div class="detail-layout"><div class="detail-image"><img src="${escapeHTML(pet.image)}" alt="${escapeHTML(pet.name)}"></div><div class="detail-copy"><span class="pet-tag">${escapeHTML(kindNames[pet.kind] || 'Thú cưng')}</span><h1>${escapeHTML(pet.name)}</h1><p class="detail-breed">${escapeHTML(pet.breed)} · ${escapeHTML(pet.sex || '')} · ${escapeHTML(pet.age)}</p><strong class="detail-price">${money(pet.price)}</strong><p>${escapeHTML(pet.description || 'Người bán sẽ chia sẻ thêm thông tin khi liên hệ.')}</p><dl class="pet-facts"><div><dt>Tình trạng</dt><dd>${escapeHTML(pet.health || 'Liên hệ người bán')}</dd></div><div><dt>Người bán</dt><dd>${escapeHTML(pet.sellerName || 'Thành viên Nhà Bông')}</dd></div></dl>${contact}<p class="seller-note">${isStore ? 'Sản phẩm của cửa hàng. Đặt hàng qua giỏ và chọn COD hoặc chuyển khoản.' : 'Tin đăng thành viên. Hãy liên hệ trực tiếp người bán để hỏi thêm và thống nhất giao dịch.'}</p></div></div></section>`;
}

function renderCart() {
  const rows = state.cart.map((item) => {
    const pet = state.pets.find((candidate) => candidate.id === item.id && candidate.active !== false);
    if (!pet) return '';
    return `<article class="cart-row"><img src="${escapeHTML(pet.image)}" alt=""><div><h3>${escapeHTML(pet.name)}</h3><p>${escapeHTML(pet.breed)} · ${item.quantity} bé</p><button class="remove-item" type="button" data-action="remove-cart" data-id="${escapeHTML(pet.id)}">Bỏ khỏi giỏ</button></div><strong>${money(pet.price * item.quantity)}</strong></article>`;
  }).join('');
  const total = state.cart.reduce((sum, item) => sum + (state.pets.find((pet) => pet.id === item.id)?.price || 0) * item.quantity, 0);
  if (!rows) return `<section class="page-section"><p class="eyebrow">Chuẩn bị đón thành viên mới</p><h1>Giỏ hàng</h1><div class="empty-panel"><h2>Giỏ đang trống</h2><p>Thêm một bé của Nhà Bông vào giỏ để bắt đầu đặt hàng.</p>${routeLink('catalog', 'Khám phá thú cưng →', 'button button-primary')}</div></section>`;
  return `<section class="page-section"><p class="eyebrow">Kiểm tra lại trước khi đặt</p><h1>Giỏ hàng <span>của bạn</span></h1><div class="checkout-layout"><div class="cart-list">${rows}<p class="cart-disclaimer">Tin từ người bán thành viên không thể thêm vào giỏ; hãy liên hệ trực tiếp người đăng.</p></div><form class="checkout-panel" data-form="checkout"><h2>Thông tin nhận bé</h2><label>Họ tên<input name="name" required value="${escapeHTML(currentUser()?.name || '')}"></label><label>Số điện thoại<input name="phone" required inputmode="tel" value="${escapeHTML(currentUser()?.phone || '')}"></label><label>Địa chỉ nhận hàng<textarea name="address" rows="3" required></textarea></label><fieldset><legend>Phương thức thanh toán</legend><label class="radio-row"><input type="radio" name="payment" value="cod" checked> Thanh toán khi nhận (COD)</label><label class="radio-row"><input type="radio" name="payment" value="bank"> Chuyển khoản ngân hàng</label></fieldset><div class="bank-note" hidden>Ngân hàng Nhà Bông · 0123 456 789 · NGUYEN THI BONG</div><div class="cart-total"><span>Tổng cộng</span><strong>${money(total)}</strong></div><button class="button button-primary" type="submit">Đặt hàng</button><p class="cart-disclaimer">Bản demo lưu đơn trong trình duyệt, chưa kết nối vận chuyển hay thanh toán thật.</p></form></div></section>`;
}

function renderAccount() {
  const user = currentUser();
  if (user) return `<section class="page-section narrow-section"><p class="eyebrow">Tài khoản Nhà Bông</p><h1>Xin chào, <span>${escapeHTML(user.name)}</span></h1><form class="form-panel" data-form="profile"><h2>Thông tin cá nhân</h2><label>Họ tên<input name="name" value="${escapeHTML(user.name)}" required></label><label>Email<input value="${escapeHTML(user.email)}" disabled></label><label>Số điện thoại<input name="phone" value="${escapeHTML(user.phone || '')}" inputmode="tel"></label><button class="button button-primary" type="submit">Lưu thông tin</button><button class="button button-quiet" type="button" data-action="logout">Đăng xuất</button></form></section>`;
  return `<section class="page-section narrow-section"><p class="eyebrow">Chào mừng đến với Nhà Bông</p><h1>${authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</h1><form class="form-panel" data-form="account"><label>Email<input name="email" type="email" autocomplete="email" required></label>${authMode === 'register' ? '<label>Họ tên<input name="name" autocomplete="name" required></label><label>Số điện thoại<input name="phone" inputmode="tel"></label>' : ''}<label>Mật khẩu<input name="password" type="password" minlength="6" autocomplete="${authMode === 'login' ? 'current-password' : 'new-password'}" required></label><button class="button button-primary" type="submit">${authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</button><button class="text-link auth-switch" type="button" data-action="toggle-auth">${authMode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button></form><aside class="demo-note"><strong>Tài khoản quản trị demo</strong><br>admin@nhabong.vn · nhabong123<br><button class="text-link" type="button" data-action="demo-admin">Điền tài khoản demo</button></aside><p class="fine-print">Đây là bản demo: tài khoản được lưu trên thiết bị hiện tại, không dùng mật khẩu thật.</p></section>`;
}

function renderContact() {
  return `<section class="page-section"><p class="eyebrow">Tụi mình luôn ở đây</p><h1>Liên hệ <span>Nhà Bông</span></h1><div class="contact-layout"><div class="contact-band"><div><h2>Tiệm Nhà Bông</h2><p>28 Nguyễn Văn Thương, Bình Thạnh, TP. Hồ Chí Minh</p><p>Thứ Hai – Chủ Nhật · 09:00 – 20:00</p><p><a href="tel:0901234567">090 123 4567</a></p><p><a href="mailto:hello@nhabong.vn">hello@nhabong.vn</a></p></div></div><form class="form-panel" data-form="contact"><h2>Gửi lời nhắn</h2><label>Tên của bạn<input name="name" value="${escapeHTML(currentUser()?.name || '')}" required></label><label>Email<input name="email" type="email" value="${escapeHTML(currentUser()?.email || '')}" required></label><label>Nội dung<textarea name="message" rows="5" required></textarea></label><button class="button button-primary" type="submit">Gửi tin nhắn</button><p class="fine-print">Tin nhắn demo được lưu trong trình duyệt, chưa gửi tới máy chủ.</p></form></div></section>`;
}

function renderSell(id) {
  const user = currentUser();
  if (!user) return `<section class="page-section narrow-section"><h1>Đăng nhập để đăng tin</h1><p class="lead">Tin đăng được gắn với tài khoản để bạn quản lý và cập nhật trạng thái.</p>${routeLink('account', 'Đăng nhập / đăng ký →', 'button button-primary')}</section>`;
  const pet = id ? state.listings.find((listing) => listing.id === id && listing.ownerId === user.id) : null;
  if (id && !pet) return `<section class="page-section"><h1>Không tìm thấy tin của bạn</h1>${routeLink('my-listings', 'Quay lại tin đã đăng →', 'button button-primary')}</section>`;
  return `<section class="page-section narrow-section"><p class="eyebrow">${pet ? 'Cập nhật thông tin' : 'Kết nối bé với gia đình mới'}</p><h1>${pet ? 'Sửa tin đăng' : 'Đăng tin bán thú cưng'}</h1><p class="lead">Tin sẽ ở trạng thái chờ duyệt. Người mua liên hệ trực tiếp với bạn sau khi tin được duyệt.</p><form class="form-panel" data-form="listing" data-id="${escapeHTML(pet?.id || '')}" data-image="${escapeHTML(pet?.image || '')}" data-video="${escapeHTML(pet?.video || '')}"><label>Tên thú cưng<input name="name" value="${escapeHTML(pet?.name || '')}" required maxlength="60"></label><div class="form-row"><label>Loài<select name="kind" required>${Object.entries(kindNames).map(([key, label]) => `<option value="${key}" ${pet?.kind === key ? 'selected' : ''}>${label}</option>`).join('')}</select></label><label>Giống<input name="breed" value="${escapeHTML(pet?.breed || '')}" required></label></div><div class="form-row"><label>Tuổi<input name="age" value="${escapeHTML(pet?.age || '')}" placeholder="Ví dụ: 3 tháng" required></label><label>Giới tính<select name="sex"><option>Bé trai</option><option ${pet?.sex === 'Bé gái' ? 'selected' : ''}>Bé gái</option></select></label></div><div class="form-row"><label>Giá (₫)<input name="price" type="number" min="0" step="10000" value="${escapeHTML(pet?.price || '')}" required></label><label>Số điện thoại<input name="phone" inputmode="tel" value="${escapeHTML(pet?.phone || user.phone || '')}" required></label></div><label>Khu vực<input name="location" value="${escapeHTML(pet?.location || '')}" placeholder="Quận, thành phố" required></label><label>Mô tả<textarea name="description" rows="4" required>${escapeHTML(pet?.description || '')}</textarea></label><label>Ảnh thú cưng ${pet ? '(để trống để giữ ảnh hiện tại)' : ''}<input name="imageFile" type="file" accept="image/*" ${pet ? '' : 'required'}></label><label>Video ngắn (không bắt buộc)<input name="videoFile" type="file" accept="video/*"></label><div class="upload-preview" id="upload-preview">${pet?.image ? `<img src="${escapeHTML(pet.image)}" alt="Ảnh xem trước">` : '<span>Ảnh xem trước sẽ hiện ở đây</span>'}</div><p class="fine-print">Ảnh sẽ được thu nhỏ để lưu trong trình duyệt. Video tối đa 500 KB. Không tải ảnh chứa thông tin riêng tư.</p><button class="button button-primary" type="submit">${pet ? 'Gửi cập nhật chờ duyệt' : 'Xem trước và gửi duyệt'}</button></form></section>`;
}

function renderMyListings() {
  const user = currentUser();
  if (!user) return `<section class="page-section narrow-section"><h1>Tin đăng của tôi</h1><p>Đăng nhập để quản lý tin của bạn.</p>${routeLink('account', 'Đăng nhập →', 'button button-primary')}</section>`;
  const listings = state.listings.filter((listing) => listing.ownerId === user.id);
  return `<section class="page-section"><div class="section-heading"><div><p class="eyebrow">Quản lý nội dung của bạn</p><h1>Tin đã <span>đăng</span></h1></div>${routeLink('sell', 'Đăng tin mới +', 'button button-primary')}</div>${listings.length ? `<div class="table-wrap"><table><thead><tr><th>Thú cưng</th><th>Giá</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead><tbody>${listings.map((pet) => `<tr><td><div class="table-pet"><img src="${escapeHTML(pet.image)}" alt=""><span><strong>${escapeHTML(pet.name)}</strong><small>${escapeHTML(pet.breed)} · ${escapeHTML(pet.age)}</small></span></div></td><td>${money(pet.price)}</td><td><span class="status-pill status-${pet.status}">${statusNames[pet.status]}</span>${pet.status === 'rejected' && pet.rejection ? `<small class="table-hint">${escapeHTML(pet.rejection)}</small>` : ''}</td><td><div class="table-actions">${pet.status !== 'sold' ? `<a href="#sell/${encodeURIComponent(pet.id)}">Sửa</a><button type="button" data-action="mark-sold" data-id="${escapeHTML(pet.id)}">Đã bán</button>` : ''}<button type="button" data-action="delete-listing" data-id="${escapeHTML(pet.id)}">Xóa</button></div></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-panel"><h2>Bạn chưa đăng tin nào</h2><p>Đăng tin đầu tiên, tụi mình sẽ duyệt trước khi hiển thị.</p></div>'}</section>`;
}

function renderAdminPets() {
  if (!isAdmin()) return `<section class="page-section narrow-section"><h1>Khu vực quản trị</h1><p>Bạn cần đăng nhập bằng tài khoản quản trị.</p>${routeLink('account', 'Đăng nhập →', 'button button-primary')}</section>`;
  const pending = state.listings.filter((pet) => pet.status === 'pending');
  const listings = state.listings;
  return `<section class="page-section"><p class="eyebrow">Bàn làm việc quản trị</p><h1>Thú cưng & <span>tin đăng</span></h1><div class="admin-tabs">${routeLink('admin-pets', 'Tin đăng & thú cưng', 'is-active')}${routeLink('admin-orders', `Đơn hàng (${state.orders.length})`, '')}</div><h2 class="subheading">Chờ duyệt <span class="count-badge">${pending.length}</span></h2>${pending.length ? `<div class="table-wrap"><table><thead><tr><th>Tin đăng</th><th>Người bán</th><th>Giá</th><th>Thao tác</th></tr></thead><tbody>${pending.map((pet) => `<tr><td><div class="table-pet"><img src="${escapeHTML(pet.image)}" alt=""><span><strong>${escapeHTML(pet.name)} · ${escapeHTML(kindNames[pet.kind])}</strong><small>${escapeHTML(pet.breed)} · ${escapeHTML(pet.age)} · ${escapeHTML(pet.location || '')}</small></span></div></td><td>${escapeHTML(pet.sellerName)}<small class="table-hint">${escapeHTML(pet.phone)}</small></td><td>${money(pet.price)}</td><td><div class="table-actions"><button type="button" data-action="approve-listing" data-id="${escapeHTML(pet.id)}">Duyệt</button><button type="button" data-action="reject-listing" data-id="${escapeHTML(pet.id)}">Từ chối</button><button type="button" data-action="edit-pet" data-id="${escapeHTML(pet.id)}">Sửa</button></div></td></tr>`).join('')}</tbody></table></div>` : '<p class="empty-inline">Không có tin chờ duyệt.</p>'}<h2 class="subheading">Tin thành viên</h2><div class="table-wrap"><table><thead><tr><th>Thú cưng</th><th>Người bán</th><th>Giá</th><th>Trạng thái</th><th>Quản lý</th></tr></thead><tbody>${listings.length ? listings.map((pet) => `<tr><td>${escapeHTML(pet.name)}<small class="table-hint">${escapeHTML(pet.breed)}</small></td><td>${escapeHTML(pet.sellerName)}</td><td>${money(pet.price)}</td><td><span class="status-pill status-${pet.status}">${statusNames[pet.status]}</span></td><td><div class="table-actions"><button type="button" data-action="edit-pet" data-id="${escapeHTML(pet.id)}">Sửa</button><button type="button" data-action="delete-admin-listing" data-id="${escapeHTML(pet.id)}">Xóa</button></div></td></tr>`).join('') : '<tr><td colspan="5">Chưa có tin thành viên.</td></tr>'}</tbody></table></div><h2 class="subheading">Sản phẩm cửa hàng</h2><div class="table-wrap"><table><thead><tr><th>Thú cưng</th><th>Loài</th><th>Giá</th><th>Quản lý</th></tr></thead><tbody>${state.pets.map((pet) => `<tr><td>${escapeHTML(pet.name)}<small class="table-hint">${escapeHTML(pet.breed)}</small></td><td>${kindNames[pet.kind]}</td><td>${money(pet.price)}</td><td><div class="table-actions"><button type="button" data-action="edit-pet" data-id="${escapeHTML(pet.id)}">Sửa</button><button type="button" data-action="toggle-pet" data-id="${escapeHTML(pet.id)}">${pet.active === false ? 'Hiện lại' : 'Ẩn'}</button></div></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderAdminOrders() {
  if (!isAdmin()) return `<section class="page-section narrow-section"><h1>Khu vực quản trị</h1>${routeLink('account', 'Đăng nhập quản trị →', 'button button-primary')}</section>`;
  const orderStatuses = ['Mới đặt', 'Đã xác nhận', 'Đang giao', 'Hoàn tất', 'Đã hủy'];
  return `<section class="page-section"><p class="eyebrow">Theo dõi đơn đặt hàng</p><h1>Quản lý <span>đơn hàng</span></h1><div class="admin-tabs">${routeLink('admin-pets', 'Tin đăng & thú cưng', '')}${routeLink('admin-orders', `Đơn hàng (${state.orders.length})`, 'is-active')}</div>${state.orders.length ? `<div class="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng</th><th>Thanh toán</th><th>Trạng thái</th></tr></thead><tbody>${[...state.orders].reverse().map((order) => `<tr><td>${escapeHTML(order.id)}</td><td>${escapeHTML(order.customer)}<small class="table-hint">${escapeHTML(order.phone)} · ${escapeHTML(order.address)}</small></td><td>${order.items.map((item) => `${escapeHTML(item.name)} × ${item.quantity}`).join('<br>')}</td><td>${money(order.total)}</td><td>${order.payment === 'cod' ? 'COD' : 'Chuyển khoản'}</td><td><select data-order-status="${escapeHTML(order.id)}">${orderStatuses.map((status) => `<option ${order.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-panel"><h2>Chưa có đơn hàng</h2><p>Đơn đặt từ giỏ hàng sẽ xuất hiện ở đây.</p></div>'}</section>`;
}

function renderReviewQueue() {
  if (!isAdmin()) return `<section class="page-section narrow-section"><h1>Duyệt bài đăng</h1><p>Bạn cần đăng nhập bằng tài khoản quản trị.</p>${routeLink('account', 'Đăng nhập →', 'button button-primary')}</section>`;
  const pending = state.listings.filter((listing) => listing.status === 'pending')
    .sort((first, second) => Date.parse(second.createdAt || '') - Date.parse(first.createdAt || ''));
  return `<section class="page-section"><p class="eyebrow">Bàn làm việc quản trị</p><h1>Duyệt <span>bài đăng</span></h1><p class="lead">Chỉ tin được duyệt mới xuất hiện trong danh sách thú cưng. Người đăng tự quản lý việc sửa và xóa tin.</p><h2 class="subheading">Chờ duyệt <span class="count-badge">${pending.length}</span></h2>${pending.length ? `<div class="table-wrap"><table><thead><tr><th>Tin đăng</th><th>Người bán</th><th>Giá</th><th>Thao tác</th></tr></thead><tbody>${pending.map((pet) => `<tr><td><div class="table-pet"><img src="${escapeHTML(pet.image)}" alt=""><span><strong>${escapeHTML(pet.name)} · ${escapeHTML(kindNames[pet.kind])}</strong><small>${escapeHTML(pet.breed)} · ${escapeHTML(pet.age)} · ${escapeHTML(pet.location || '')}</small></span></div></td><td>${escapeHTML(pet.sellerName)}<small class="table-hint">${escapeHTML(pet.phone)}</small></td><td>${money(pet.price)}</td><td><div class="table-actions"><button type="button" data-action="approve-listing" data-id="${escapeHTML(pet.id)}">Duyệt</button><button type="button" data-action="reject-listing" data-id="${escapeHTML(pet.id)}">Từ chối</button></div></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-panel"><h2>Không có bài đăng chờ duyệt</h2><p>Tin mới từ người bán sẽ xuất hiện tại đây.</p></div>'}</section>`;
}

function render() {
  updateHeader();
  const [route = 'home', detail] = routeParts();
  const views = {
    home: renderHome,
    about: renderAbout,
    catalog: renderCatalog,
    cart: renderCart,
    account: renderAccount,
    contact: renderContact,
    'my-listings': renderMyListings,
    'admin-pets': renderReviewQueue,
  };
  if (route === 'pet') app.innerHTML = renderPetDetail(detail);
  else if (route === 'sell') app.innerHTML = renderSell(detail);
  else app.innerHTML = (views[route] || renderHome)();
  document.title = `${route === 'home' ? 'Nhà Bông' : 'Nhà Bông · ' + (document.querySelector('main h1')?.textContent || 'Thú cưng')}`;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function applyCatalogFilters() {
  const grid = document.querySelector('#catalog-grid');
  if (!grid) return;
  const query = document.querySelector('#catalog-search').value.trim().toLocaleLowerCase('vi');
  const kind = document.querySelector('#catalog-kind').value;
  const min = Number(document.querySelector('#catalog-min').value) || 0;
  const max = Number(document.querySelector('#catalog-max').value) || Infinity;
  const sort = document.querySelector('#catalog-sort').value;
  const pets = allPets().filter((pet) => (kind === 'all' || pet.kind === kind) && pet.price >= min && pet.price <= max && `${pet.name} ${pet.breed}`.toLocaleLowerCase('vi').includes(query));
  if (sort === 'low') pets.sort((a, b) => a.price - b.price);
  if (sort === 'high') pets.sort((a, b) => b.price - a.price);
  grid.innerHTML = pets.map(petCard).join('');
  document.querySelector('#catalog-count').textContent = `${pets.length} bé`;
  document.querySelector('#catalog-empty').hidden = pets.length > 0;
}

function addToCart(id) {
  const pet = getPet(id);
  if (!pet || pet.sellerType !== 'store') {
    showToast('Tin thành viên cần liên hệ trực tiếp người bán.');
    return;
  }
  if (!currentUser()) {
    pendingPurchaseId = id;
    returnTo = '#cart';
    location.hash = '#account';
    showToast('Đăng nhập để thêm thú cưng vào giỏ hàng.');
    return;
  }
  const existing = state.cart.find((item) => item.id === id);
  if (existing) return showToast(`${pet.name} đã có trong giỏ hàng.`);
  state.cart.push({ id, quantity: 1 });
  saveState();
  render();
  showToast(`Đã thêm ${pet.name} vào giỏ hàng.`);
}

function continueAfterAuthentication() {
  if (pendingPurchaseId) {
    const id = pendingPurchaseId;
    pendingPurchaseId = null;
    addToCart(id);
    location.hash = '#cart';
    return;
  }
  location.hash = returnTo;
  returnTo = '#home';
}

function updateListingStatus(id, status) {
  const listing = state.listings.find((item) => item.id === id);
  if (!listing) return;
  listing.status = status;
  if (status === 'live') listing.approvedAt = new Date().toISOString();
  if (status === 'sold') listing.adoptedAt = new Date().toISOString();
  if (status !== 'rejected') delete listing.rejection;
  saveState();
  render();
}

async function fileData(file, isVideo = false) {
  if (!file) return '';
  if (isVideo) {
    if (file.size > 500 * 1024) throw new Error('Video tối đa 500 KB trong bản demo.');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  if (!file.type.startsWith('image/')) throw new Error('Vui lòng chọn tệp ảnh hợp lệ.');
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('Không thể đọc ảnh. Hãy chọn JPG, PNG hoặc WebP.');
  }
  const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.78));
  bitmap.close();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function handleSubmit(event) {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  event.preventDefault();
  const formType = form.dataset.form;
  const values = readForm(form);

  if (formType === 'account') {
    const email = values.email.trim().toLowerCase();
    if (authMode === 'register') {
      if (state.users.some((user) => user.email === email)) return showToast('Email này đã có tài khoản.');
      const user = { id: crypto.randomUUID(), name: values.name.trim(), email, password: values.password, phone: values.phone.trim(), role: 'member' };
      state.users.push(user);
      state.currentUserId = user.id;
      saveState();
      continueAfterAuthentication();
    } else {
      const user = state.users.find((item) => item.email === email && item.password === values.password);
      if (!user) return showToast('Email hoặc mật khẩu chưa đúng.');
      state.currentUserId = user.id;
      saveState();
      continueAfterAuthentication();
    }
  }

  if (formType === 'profile') {
    const user = currentUser();
    user.name = values.name.trim();
    user.phone = values.phone.trim();
    saveState();
    render();
    showToast('Đã cập nhật thông tin.');
  }

  if (formType === 'contact') {
    state.messages.push({ id: crypto.randomUUID(), ...values, createdAt: new Date().toISOString() });
    saveState();
    form.reset();
    showToast('Đã lưu lời nhắn trong bản demo.');
  }

  if (formType === 'listing') {
    const user = currentUser();
    const oldListing = state.listings.find((item) => item.id === form.dataset.id && item.ownerId === user.id);
    let image = form.dataset.image;
    let video = form.dataset.video;
    try {
      const imageFile = form.elements.imageFile.files[0];
      const videoFile = form.elements.videoFile.files[0];
      if (imageFile) image = await fileData(imageFile);
      if (videoFile) video = await fileData(videoFile, true);
      if (!image) return showToast('Hãy tải ảnh thú cưng lên.');
    } catch (error) {
      return showToast(error.message || 'Không thể đọc tệp đã chọn.');
    }
    const listing = {
      id: oldListing?.id || crypto.randomUUID(), ownerId: user.id, sellerName: user.name, sellerType: 'member',
      name: values.name.trim(), kind: values.kind, breed: values.breed.trim(), age: values.age.trim(), sex: values.sex,
      price: Number(values.price), phone: values.phone.trim(), location: values.location.trim(), description: values.description.trim(),
      image, video, health: 'Người bán tự khai báo', status: 'pending', active: true,
      createdAt: oldListing?.createdAt || new Date().toISOString(),
    };
    if (oldListing) Object.assign(oldListing, listing);
    else state.listings.push(listing);
    saveState();
    showToast('Tin đã gửi và đang chờ quản trị viên duyệt.');
    location.hash = '#my-listings';
  }

  if (formType === 'checkout') {
    if (!currentUser()) {
      returnTo = '#cart';
      location.hash = '#account';
      showToast('Đăng nhập để hoàn tất đặt hàng.');
      return;
    }
    const items = state.cart.map((item) => {
      const pet = state.pets.find((candidate) => candidate.id === item.id);
      return pet ? { id: pet.id, name: pet.name, price: pet.price, quantity: item.quantity } : null;
    }).filter(Boolean);
    if (!items.length) return showToast('Giỏ hàng đang trống.');
    const order = {
      id: `NB-${Date.now().toString().slice(-7)}`, customer: values.name.trim(), phone: values.phone.trim(), address: values.address.trim(),
      payment: values.payment, items, total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), status: 'Mới đặt',
      createdAt: new Date().toISOString(), userId: state.currentUserId,
    };
    items.forEach((item) => {
      const pet = state.pets.find((candidate) => candidate.id === item.id);
      if (pet) {
        pet.active = false;
        pet.status = 'adopted';
        pet.adoptedAt = order.createdAt;
      }
    });
    state.orders.push(order);
    state.cart = [];
    saveState();
    render();
    document.querySelector('main').insertAdjacentHTML('afterbegin', `<div class="order-success"><strong>Đặt hàng thành công · ${escapeHTML(order.id)}</strong><span>${escapeHTML(items.map((item) => item.name).join(', '))} đã tìm thấy nhà. ${order.payment === 'cod' ? 'Nhà Bông sẽ xác nhận và liên hệ bạn.' : 'Ngân hàng Nhà Bông · STK 0123 456 789 · NGUYEN THI BONG (demo).'}</span></div>`);
    showToast('Đơn hàng đã được tạo trong bản demo.');
  }
}

function openAdminEdit(id) {
  const pet = getPet(id);
  if (!pet) return;
  const dialog = document.querySelector('#edit-pet-dialog');
  dialog.innerHTML = `<form class="form-panel" data-form="admin-edit" data-id="${escapeHTML(id)}"><div class="dialog-header"><div><p class="eyebrow">Quản lý thú cưng</p><h2>Chỉnh sửa thông tin</h2></div><button class="dialog-close" type="button" data-action="close-edit" aria-label="Đóng">×</button></div><label>Tên<input name="name" value="${escapeHTML(pet.name)}" required></label><div class="form-row"><label>Loài<select name="kind">${Object.entries(kindNames).map(([key, label]) => `<option value="${key}" ${pet.kind === key ? 'selected' : ''}>${label}</option>`).join('')}</select></label><label>Giống<input name="breed" value="${escapeHTML(pet.breed)}" required></label></div><div class="form-row"><label>Tuổi<input name="age" value="${escapeHTML(pet.age)}" required></label><label>Giá<input name="price" type="number" min="0" value="${pet.price}" required></label></div><label>Mô tả<textarea name="description" rows="4">${escapeHTML(pet.description || '')}</textarea></label><label>Số liên hệ<input name="phone" value="${escapeHTML(pet.phone || '')}"></label><button class="button button-primary" type="submit">Lưu thay đổi</button></form>`;
  dialog.showModal();
}

async function handleAdminEdit(form) {
  const values = readForm(form);
  const pet = getPet(form.dataset.id);
  if (!pet) return;
  Object.assign(pet, { name: values.name.trim(), kind: values.kind, breed: values.breed.trim(), age: values.age.trim(), price: Number(values.price), description: values.description.trim(), phone: values.phone.trim() });
  if (pet.sellerType !== 'store') pet.status = 'pending';
  saveState();
  document.querySelector('#edit-pet-dialog').close();
  render();
  showToast(pet.sellerType === 'store' ? 'Đã cập nhật sản phẩm.' : 'Tin đã chuyển về trạng thái chờ duyệt.');
}

document.addEventListener('click', (event) => {
  const cartButton = event.target.closest('.cart-trigger');
  if (cartButton) location.hash = '#cart';
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const { action, id } = actionButton.dataset;
  if (action === 'add-cart') addToCart(id);
  if (action === 'remove-cart') { state.cart = state.cart.filter((item) => item.id !== id); saveState(); render(); }
  if (action === 'favorite') {
    state.favorites = state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
    saveState();
    if (routeParts()[0] === 'catalog') applyCatalogFilters(); else render();
  }
  if (action === 'toggle-auth') { authMode = authMode === 'login' ? 'register' : 'login'; render(); }
  if (action === 'demo-admin') {
    document.querySelector('[name="email"]').value = 'admin@nhabong.vn';
    document.querySelector('[name="password"]').value = 'nhabong123';
  }
  if (action === 'logout') { state.currentUserId = null; saveState(); location.hash = '#home'; }
  if (action === 'approve-listing') updateListingStatus(id, 'live');
  if (action === 'reject-listing') {
    const reason = prompt('Lý do từ chối tin (không bắt buộc):') || '';
    const listing = state.listings.find((item) => item.id === id);
    if (listing) listing.rejection = reason;
    updateListingStatus(id, 'rejected');
  }
  if (action === 'mark-sold') updateListingStatus(id, 'sold');
  if (action === 'delete-listing' || action === 'delete-admin-listing') {
    if (confirm('Xóa tin đăng này?')) { state.listings = state.listings.filter((item) => item.id !== id); saveState(); render(); }
  }
  if (action === 'toggle-pet') { const pet = state.pets.find((item) => item.id === id); pet.active = pet.active === false; saveState(); render(); }
  if (action === 'edit-pet') openAdminEdit(id);
  if (action === 'close-edit') document.querySelector('#edit-pet-dialog').close();
});

document.addEventListener('submit', (event) => { handleSubmit(event); });
document.addEventListener('submit', (event) => {
  const form = event.target.closest('form[data-form="admin-edit"]');
  if (form) { event.preventDefault(); handleAdminEdit(form); }
});

document.addEventListener('input', (event) => {
  if (event.target.matches('#catalog-search')) applyCatalogFilters();
});
document.addEventListener('change', (event) => {
  if (event.target.matches('#catalog-kind, #catalog-min, #catalog-max, #catalog-sort')) applyCatalogFilters();
  if (event.target.matches('[data-order-status]')) {
    const order = state.orders.find((item) => item.id === event.target.dataset.orderStatus);
    if (order) { order.status = event.target.value; saveState(); showToast('Đã cập nhật trạng thái đơn.'); }
  }
  if (event.target.matches('[name="payment"]')) {
    const note = document.querySelector('.bank-note');
    if (note) note.hidden = event.target.value !== 'bank';
  }
  if (event.target.matches('[name="imageFile"], [name="videoFile"]')) {
    const file = event.target.files[0];
    const preview = document.querySelector('#upload-preview');
    if (!file || !preview) return;
    const url = URL.createObjectURL(file);
    preview.innerHTML = file.type.startsWith('video/') ? `<video src="${url}" controls muted></video>` : `<img src="${url}" alt="Ảnh xem trước">`;
  }
});

document.querySelector('.cart-trigger').addEventListener('click', (event) => event.preventDefault());
window.addEventListener('hashchange', render);
if (!location.hash) location.hash = '#home';
render();
