# 👟 SneakCart — Sneaker Marketplace

A full-stack sneaker marketplace with live auctions, cart, wishlist, and order management.

**Frontend:** React + Vite + plain CSS  
**Backend:** Spring Boot microservices  
**Database:** PostgreSQL  
**Cache:** Redis  
**Messaging:** Kafka  
**Real-time:** WebSocket (STOMP)

---

## Project Structure

```
sneaker-marketplace/                          ROOT
│
├── .gitignore                                Ignores: node_modules/, target/, dist/, .env, .idea/, .DS_Store
├── README.md                                 Project overview, setup steps, API reference, tech stack table
├── docker-compose.yml                        Runs all 8 containers: PostgreSQL + Redis + Kafka + Zookeeper + 5 backend services + frontend
├── SYSTEM_DESIGN.md                          Architecture diagram, bid event flow, Redis concurrency model, failure handling table, scaling strategy
│
├── infra/
│   └── init.sql                              Creates 5 PostgreSQL databases on first Docker boot:
│                                             sneakcart, sneakcart_auth, sneakcart_products, sneakcart_orders, sneakcart_bids
│
│
├── frontend/
│   └── sneaker-marketplace/
│       ├── index.html                        HTML shell — mounts React at <div id="root">, sets page title
│       ├── vite.config.js                    Vite build tool config with React plugin
│       ├── package.json                      npm dependencies: react, react-router-dom, @stomp/stompjs, sockjs-client
│       ├── Dockerfile                        Multi-stage: Node 20 builds → Nginx serves dist/
│       ├── nginx.conf                        SPA routing (all paths → index.html), /api proxy to backend
│       │
│       └── src/
│           ├── main.jsx                      React entry point — mounts <App /> into DOM
│           ├── App.jsx                       Contains:
│           │                                 - BrowserRouter
│           │                                 - AuthProvider, CartProvider, WishlistProvider (context wrappers)
│           │                                 - ProtectedRoute component (redirects to / if not logged in)
│           │                                 - All route definitions: /, /products, /product/:id,
│           │                                   /trends, /auction/:id, /wishlist, /cart, /checkout, /orders
│           │                                 - Navbar + Footer layout
│           │
│           ├── index.css                     Global styles: CSS reset, body font, .main-content layout
│           │
│           ├── assets/
│           │   ├── dummy.jpg                 Fallback image shown when product image URL is missing
│           │   ├── hero-section-img.jpg      Hero banner image on Home page
│           │   ├── running.avif              "Running" category card image
│           │   ├── basket.webp               "Basketball" category card image
│           │   ├── lifestyle.jpg             "Lifestyle" category card image
│           │   ├── skate.jpg                 "Skate" category card image
│           │   └── products/                 Empty folder — drop local shoe .jpg/.png files here
│           │
│           ├── context/
│           │   ├── AuthContext.jsx           Contains:
│           │   │                             - currentUser state (loaded from localStorage on start)
│           │   │                             - signup(name, email, password) — saves to localStorage.users[]
│           │   │                             - login(email, password) — validates against localStorage.users[]
│           │   │                             - logout() — removes currentUser from localStorage + clears state
│           │   │                             - useAuth() hook export
│           │   │
│           │   ├── CartContext.jsx           Contains:
│           │   │                             - cart[] state (loaded from localStorage on start)
│           │   │                             - addToCart(product, selectedSize)
│           │   │                             - removeFromCart(cartKey)
│           │   │                             - updateQty(cartKey, delta)
│           │   │                             - clearCart()
│           │   │                             - cartCount (derived: total items)
│           │   │                             - cartTotal (derived: total price in ₹)
│           │   │                             - useEffect syncs cart → localStorage on every change
│           │   │                             - useCart() hook export
│           │   │
│           │   └── WishlistContext.jsx       Contains:
│           │                                 - wishlist[] state (loaded from localStorage on start)
│           │                                 - toggleWishlist(product) — add if not present, remove if present
│           │                                 - isWishlisted(id) — returns true/false
│           │                                 - removeFromWishlist(id)
│           │                                 - useEffect syncs wishlist → localStorage on every change
│           │                                 - useWishlist() hook export
│           │
│           ├── hooks/
│           │   ├── useFetch.js               Custom hook — generic async data fetcher
│           │   │                             Returns: { data, loading, error, refetch }
│           │   │                             Used for: future API calls to backend
│           │   │
│           │   └── useAuctionSocket.js       Custom hook — WebSocket client for real-time bidding
│           │                                 Contains:
│           │                                 - STOMP client using @stomp/stompjs + SockJS
│           │                                 - Connects to ws://localhost:8084/ws
│           │                                 - Subscribes to /topic/auction/:auctionId
│           │                                 - Auto-reconnects every 3 seconds on disconnect
│           │                                 - Returns: { latestBid, connected, reconnecting }
│           │
│           ├── utils/
│           │   └── getImage.js               Utility function — resolves product image
│           │                                 - If image starts with "http" → return URL directly
│           │                                 - Otherwise → return dummy.jpg fallback
│           │
│           ├── services/
│           │   ├── productService.js         ALL dummy data for the frontend:
│           │   │                             - img{} object — 40 Unsplash image URLs (25 products + 15 auctions)
│           │   │                             - products[] — 25 sneakers with id, name, brand, price, color,
│           │   │                               sizes, badge, description, image URL
│           │   │                             - auctionShoes[] — 15 auction items with basePrice, currentBid,
│           │   │                               endsAt timestamp, leaderboard[], image URL
│           │   │                             - getOrders() — 2 dummy past orders
│           │   │                             - savedAddresses[] — 2 dummy delivery addresses
│           │   │
│           │   └── api.js                    All backend API fetch wrappers (ready to connect):
│           │                                 - apiGetProducts(), apiGetProduct(id), apiFilterProducts(params)
│           │                                 - apiGetAuctions()
│           │                                 - apiPlaceOrder(order), apiGetOrders(userId)
│           │                                 - apiPlaceBid(bid), apiGetHighest(auctionId), apiLeaderboard(auctionId)
│           │                                 - apiRegister(data), apiLogin(data)
│           │
│           ├── components/
│           │   ├── Navbar.jsx                Contains:
│           │   │                             - Logo (left) → navigates to /
│           │   │                             - Center links: Products, Trends (NavLink with active class)
│           │   │                             - Right: Wishlist (with count badge), Cart (with count badge)
│           │   │                             - Orders button → checks auth, opens modal if not logged in
│           │   │                             - Auth section: Sign In / Sign Up buttons (logged out)
│           │   │                             - Hello, {name} + dropdown with My Orders, Wishlist, Logout (logged in)
│           │   │                             - Opens AuthModal with correct mode on button click
│           │   │
│           │   ├── Navbar.css                Sticky dark navbar, 3-section flex layout, active link highlight,
│           │   │                             nav-badge circle, user dropdown animation, Sign In/Up button styles
│           │   │
│           │   ├── Footer.jsx                Contains:
│           │   │                             - Brand name + tagline
│           │   │                             - Quick links: Products, Trends, Wishlist, Orders
│           │   │                             - Contact: email + phone
│           │   │                             - Copyright year (dynamic)
│           │   │
│           │   ├── Footer.css                Dark footer, 3-column flex layout, hover link color
│           │   │
│           │   ├── ProductCard.jsx           Contains:
│           │   │                             - Product image (via getImage) → clicking navigates to /product/:id
│           │   │                             - Badge overlay (New/Hot/Sale/Trending)
│           │   │                             - Wishlist heart button (filled/outlined, uses WishlistContext)
│           │   │                             - Brand, name (clicking navigates to /product/:id)
│           │   │                             - Color dot + color name
│           │   │                             - Price in ₹ (en-IN locale)
│           │   │                             - Size selector buttons (highlights selected)
│           │   │                             - "Select a size" hint when no size chosen
│           │   │                             - Add to Cart button (disabled until size selected, flashes green)
│           │   │
│           │   ├── ProductCard.css           Card hover lift effect, badge absolute positioning,
│           │   │                             size button highlight, disabled/added button states
│           │   │
│           │   ├── AuthModal.jsx             Contains:
│           │   │                             - Centered popup modal with blurred backdrop
│           │   │                             - Tab switcher: Sign In / Sign Up
│           │   │                             - Sign Up form: name + email + password
│           │   │                             - Sign In form: email + password
│           │   │                             - Show/hide password toggle button
│           │   │                             - Inline validation (email format, password min 6 chars, name required)
│           │   │                             - Error message display
│           │   │                             - Calls AuthContext.signup() or login() on submit
│           │   │                             - Closes on success, Escape key, or backdrop click
│           │   │                             - Auto-focuses first input when opened
│           │   │
│           │   ├── AuthModal.css             Backdrop blur, slide-in animation, tab switcher styles,
│           │   │                             input focus ring, error box, submit button hover
│           │   │
│           │   ├── LoadingError.jsx          Two reusable components:
│           │   │                             - <LoadingSpinner /> — spinning circle animation
│           │   │                             - <ErrorMessage message onRetry /> — error box with retry button
│           │   │
│           │   └── LoadingError.css          Spinner keyframe animation, error box red styling
│           │
│           └── pages/
│               │
│               ├── Home.jsx                  Contains:
│               │                             - Hero section: headline, description, Shop Now + See Trends buttons, hero image
│               │                             - Category grid: Running, Basketball, Lifestyle, Skate (real images)
│               │                             - Featured Products: first 8 products as ProductCard components
│               │                             - Promo banner: "Members get 20% off" with Join Now button
│               ├── Home.css                  Hero gradient dark background, category image overlay,
│               │                             4-col product grid, promo banner orange background
│               │
│               ├── Products.jsx              Contains:
│               │                             - All 25 products displayed as ProductCard grid
│               │                             - Sidebar filters (sticky):
│               │                               • Price range slider (min to max, step 500)
│               │                               • Color filter buttons (All + 5 colors)
│               │                             - Sort dropdown: Default / Price Low-High / Price High-Low
│               │                             - Live result count
│               │                             - No results state with Clear Filters button
│               │                             - useMemo for filtered + sorted list
│               ├── Products.css              Sidebar sticky layout, range input accent color,
│               │                             color swatch buttons, 3-col product grid
│               │
│               ├── ProductDetail.jsx         Contains:
│               │                             - Breadcrumb: Home / Products / {name}
│               │                             - LEFT column (sticky): main product image + 3 thumbnail buttons
│               │                             - RIGHT column:
│               │                               • Brand, name, price (with strikethrough for Sale items)
│               │                               • Color dot + color name
│               │                               • Description paragraph
│               │                               • Size selector (highlights selected, stores in useState)
│               │                               • Size error message if no size selected
│               │                               • Cart confirmation green banner (2.5s)
│               │                               • Add to Cart button → CartContext + localStorage
│               │                               • Buy Now button → writes checkoutItem to localStorage → /checkout
│               │                               • Free Delivery / 30-Day Returns / Authentic pills
│               │                             - Recommended section: 4 products (same brand first)
│               │                             - useEffect resets state + scrolls to top on product change
│               │                             - Uses shared products[] from productService (not local copy)
│               ├── ProductDetail.css         Two-col sticky layout, image zoom on hover, size button highlight,
│               │                             cart confirm fade-in animation, recommended 4-col grid
│               │
│               ├── Trends.jsx                Contains:
│               │                             - Hero banner: "Live Auctions" with stats (15 active, 3 ending soon)
│               │                             - 15 AuctionCard components in 3-col grid
│               │                             - Each AuctionCard:
│               │                               • Real product image (via getImage)
│               │                               • #rank badge, 🔴 LIVE badge
│               │                               • Brand, name
│               │                               • Current bid in ₹
│               │                               • Live countdown timer (HH:MM:SS, updates every second)
│               │                               • Red urgent border when < 10 minutes remaining
│               │                               • "Place a Bid →" button → navigates to /auction/:id
│               │                             - useCountdown custom hook (setInterval, clears on unmount)
│               ├── Trends.css                Dark gradient hero, 3-col auction grid, urgent red border,
│               │                             live badge, timer font styling
│               │
│               ├── Auction.jsx               Contains:
│               │                             - Back to Auctions link
│               │                             - LEFT: product image + LIVE AUCTION pill + brand/name/color/sizes/base price
│               │                             - RIGHT panel (sticky):
│               │                               • Live countdown timer with digit blocks (HH:MM:SS)
│               │                               • Red background when urgent (< 10 min)
│               │                               • Current highest bid display
│               │                               • Top 3 leaderboard with gold/silver/bronze rank colors
│               │                               • Bid form: bidder name input + ₹ amount input
│               │                               • Validation: must be number AND > currentBid
│               │                               • Error message / success message
│               │                               • Updates leaderboard and currentBid in local state on success
│               │                             - Recommended: 4 products from productService
│               ├── Auction.css               Two-col layout, digit block timer, leaderboard rank colors,
│               │                             rupee prefix input, recommended 4-col grid
│               │
│               ├── Wishlist.jsx              Contains:
│               │                             - Header with saved item count
│               │                             - 4-col grid of ProductCard components (from WishlistContext)
│               │                             - Remove button under each card (calls removeFromWishlist)
│               │                             - Empty state: heart icon + "Your wishlist is empty" + Browse Products link
│               ├── Wishlist.css              4-col grid, red remove button with hover fill,
│               │                             empty state centered layout
│               │
│               ├── Cart.jsx                  Contains:
│               │                             - Header with "Clear Cart" button
│               │                             - LEFT: list of cart items, each showing:
│               │                               • Product image (via getImage)
│               │                               • Brand, name, size, color, unit price
│               │                               • Qty − / + buttons (calls updateQty from CartContext)
│               │                               • Line total (price × qty) in ₹
│               │                               • ✕ remove button (calls removeFromCart)
│               │                             - RIGHT sidebar (sticky): Order Summary
│               │                               • Subtotal with item count
│               │                               • Shipping: Free (green)
│               │                               • Total in ₹
│               │                               • Proceed to Checkout button → /checkout
│               │                               • Continue Shopping link → /products
│               │                             - Empty state: cart icon + "Start Shopping" button
│               ├── Cart.css                  Two-col layout, qty control buttons, sticky summary panel,
│               │                             free tag green color, empty state centered
│               │
│               ├── Checkout.jsx              Contains:
│               │                             - 4-step progress indicator (Address → Payment → Preview → Confirm)
│               │                               Each step shows: number, label, done checkmark, connector line
│               │                             - Step 1 — Address:
│               │                               • 2 saved address radio cards (from productService.savedAddresses)
│               │                               • "+ Add New Address" option
│               │                               • New address form: name, phone, address line, city, PIN
│               │                             - Step 2 — Payment:
│               │                               • UPI card (📱) with UPI ID input
│               │                               • COD card (💵)
│               │                             - Step 3 — Preview:
│               │                               • Delivery address summary
│               │                               • Payment method summary
│               │                               • All cart items with image, name, size, color, qty, price
│               │                             - Step 4 — Confirm:
│               │                               • Order summary: items count, shipping, payment, total
│               │                               • "Place Order" button → calls clearCart() → shows success screen
│               │                             - Success screen: green checkmark, city name, payment method, View Orders + Keep Shopping buttons
│               │                             - Right sidebar: live order summary (updates as cart changes)
│               ├── Checkout.css              Step indicator with active/done states, address radio cards,
│               │                             payment method cards, preview item layout, confirm summary box
│               │
│               ├── Orders.jsx                Contains:
│               │                             - Page title "My Orders"
│               │                             - List of order cards, each showing:
│               │                               • Order ID + placed date
│               │                               • Status badge (● Delivered green / ● Shipped blue / ● Processing orange)
│               │                               • Order items: image (via getImage), brand, name, size, qty, price
│               │                               • Delivery address block (name, line, city, PIN)
│               │                               • Payment method block
│               │                               • Total price + Reorder button
│               │                             - Recommended For You section: 5 product cards
│               │                             - Empty state: 📦 icon + Start Shopping button
│               ├── Orders.css                Status color mapping, order card layout, 5-col recommended grid,
│               │                             info row two-column layout
│               │
│               ├── ProductDetail.jsx         (described above — two-col detail page)
│               └── ProductDetail.css         (described above)
│
│
└── backend/
    │
    ├── sneakcart-backend/                    ← MAIN BACKEND (fully implemented, connects to PostgreSQL)
    │   ├── pom.xml                           Maven config — dependencies:
    │   │                                     spring-boot-starter-web, spring-boot-starter-data-jpa,
    │   │                                     spring-boot-starter-validation, postgresql driver, lombok
    │   ├── Dockerfile                        Multi-stage: Maven build → JRE 17 runtime, exposes port 8080
    │   │
    │   └── src/main/
    │       ├── resources/
    │       │   └── application.properties    Contains:
    │       │                                 - server.port=8080
    │       │                                 - spring.datasource.url=jdbc:postgresql://localhost:5432/sneakcart
    │       │                                 - spring.datasource.username=postgres
    │       │                                 - spring.datasource.password=postgres
    │       │                                 - spring.jpa.hibernate.ddl-auto=update (auto-creates tables)
    │       │                                 - spring.jpa.show-sql=true
    │       │                                 - HikariCP pool: max 10 connections
    │       │                                 - Jackson: dates as ISO strings not timestamps
    │       │
    │       └── java/com/sneakcart/
    │           │
    │           ├── SneakCartApplication.java Contains:
    │           │                             - @SpringBootApplication entry point
    │           │                             - CORS config bean: allows localhost:5173 and localhost:3000
    │           │                               for all /api/** endpoints, all HTTP methods
    │           │
    │           ├── entity/
    │           │   ├── User.java             @Entity → table: users
    │           │   │                         Fields: id (PK auto), name, email (unique), password
    │           │   │                         Validation: @NotBlank on name/password, @Email on email
    │           │   │
    │           │   ├── Product.java          @Entity → table: products
    │           │   │                         Fields: id (PK auto), name, brand, price, color,
    │           │   │                                 sizes (comma-separated string), badge, imageUrl, isAuction
    │           │   │                         Validation: @NotBlank on name, @Positive on price
    │           │   │
    │           │   ├── Auction.java          @Entity → table: auctions
    │           │   │                         Fields: id (PK auto), product (ManyToOne → products),
    │           │   │                                 basePrice, startTime, endTime,
    │           │   │                                 status enum: ACTIVE / ENDED / CANCELLED
    │           │   │                         Relationship: Many auctions can reference one product
    │           │   │
    │           │   ├── Bid.java              @Entity → table: bids
    │           │   │                         Fields: id (PK auto), auction (ManyToOne → auctions),
    │           │   │                                 user (ManyToOne → users), amount, timestamp (auto now)
    │           │   │                         Relationship: Many bids per auction, many bids per user
    │           │   │
    │           │   ├── Cart.java             @Entity → table: carts
    │           │   │                         Fields: id (PK auto), user (OneToOne → users, unique),
    │           │   │                                 items (OneToMany → cart_items, CascadeAll, orphanRemoval)
    │           │   │                         Relationship: Each user has exactly ONE cart
    │           │   │
    │           │   ├── CartItem.java         @Entity → table: cart_items
    │           │   │                         Fields: id (PK auto), cart (ManyToOne → carts),
    │           │   │                                 product (ManyToOne EAGER → products),
    │           │   │                                 quantity (default 1), selectedSize
    │           │   │                         Relationship: Many items per cart, each item has one product
    │           │   │
    │           │   ├── Wishlist.java         @Entity → table: wishlists
    │           │   │                         Fields: id (PK auto), user (ManyToOne → users),
    │           │   │                                 product (ManyToOne EAGER → products)
    │           │   │                         Constraint: UniqueConstraint on (user_id, product_id)
    │           │   │                                     prevents same product added twice
    │           │   │
    │           │   ├── Order.java            @Entity → table: orders
    │           │   │                         Fields: id (PK auto), user (ManyToOne → users),
    │           │   │                                 items (OneToMany → order_items, CascadeAll, orphanRemoval),
    │           │   │                                 totalPrice, addressLine, city, pinCode, phone,
    │           │   │                                 paymentMethod enum: UPI / COD,
    │           │   │                                 status enum: PROCESSING / SHIPPED / DELIVERED / CANCELLED,
    │           │   │                                 createdAt (auto now)
    │           │   │
    │           │   └── OrderItem.java        @Entity → table: order_items
    │           │                             Fields: id (PK auto), order (ManyToOne → orders),
    │           │                                     product (ManyToOne EAGER → products),
    │           │                                     quantity, selectedSize,
    │           │                                     priceAtPurchase (price snapshot at order time)
    │           │
    │           ├── repository/
    │           │   ├── UserRepository.java   Extends JpaRepository<User, Long>
    │           │   │                         Custom: findByEmail(String), existsByEmail(String)
    │           │   │
    │           │   ├── ProductRepository.java Extends JpaRepository<Product, Long>
    │           │   │                         Custom: findByIsAuction(Boolean)
    │           │   │                         JPQL: filter(color, minPrice, maxPrice) — all params optional (null = ignore)
    │           │   │
    │           │   ├── AuctionRepository.java Extends JpaRepository<Auction, Long>
    │           │   │                         Custom: findByStatus(AuctionStatus)
    │           │   │
    │           │   ├── BidRepository.java    Extends JpaRepository<Bid, Long>
    │           │   │                         Custom: findByAuctionIdOrderByAmountDesc(Long)
    │           │   │                         JPQL: findHighestBid(auctionId) → LIMIT 1 by amount DESC
    │           │   │                         JPQL: findTop3(auctionId) → LIMIT 3 by amount DESC (leaderboard)
    │           │   │
    │           │   ├── CartRepository.java   Extends JpaRepository<Cart, Long>
    │           │   │                         Custom: findByUserId(Long)
    │           │   │
    │           │   ├── CartItemRepository.java Extends JpaRepository<CartItem, Long>
    │           │   │                         Custom: findByCartIdAndProductIdAndSelectedSize(...)
    │           │   │                                 prevents duplicate cart entries for same product+size
    │           │   │
    │           │   ├── WishlistRepository.java Extends JpaRepository<Wishlist, Long>
    │           │   │                         Custom: findByUserId(Long)
    │           │   │                                 findByUserIdAndProductId(Long, Long)
    │           │   │                                 existsByUserIdAndProductId(Long, Long)
    │           │   │                                 deleteByUserIdAndProductId(Long, Long) — @Transactional
    │           │   │
    │           │   └── OrderRepository.java  Extends JpaRepository<Order, Long>
    │           │                             Custom: findByUserIdOrderByCreatedAtDesc(Long) — newest first
    │           │
    │           ├── dto/
    │           │   ├── request/
    │           │   │   ├── RegisterRequest.java  Fields: name (@NotBlank), email (@Email), password (@Size min 6)
    │           │   │   ├── LoginRequest.java     Fields: email (@Email), password (@NotBlank)
    │           │   │   ├── ProductRequest.java   Fields: name, brand, price (@Positive), color, sizes, badge, imageUrl, isAuction
    │           │   │   ├── BidRequest.java       Fields: userId (@NotNull), amount (@Positive @NotNull)
    │           │   │   ├── CartItemRequest.java  Fields: productId (@NotNull), quantity (@Min 1), selectedSize
    │           │   │   └── OrderRequest.java     Fields: userId, addressLine, city, pinCode, phone (@NotBlank), paymentMethod
    │           │   │
    │           │   └── response/
    │           │       └── UserResponse.java     Fields: id, name, email (password excluded for security)
    │           │
    │           ├── service/
    │           │   ├── UserService.java      Contains:
    │           │   │                         - register(): checks duplicate email → saves user → returns UserResponse
    │           │   │                         - login(): finds by email → validates password → returns UserResponse
    │           │   │                         - getById(): finds user or throws ResourceNotFoundException
    │           │   │
    │           │   ├── ProductService.java   Contains:
    │           │   │                         - add(): builds Product from request → saves to DB
    │           │   │                         - getAll(): returns all products
    │           │   │                         - getById(): finds or throws 404
    │           │   │                         - filter(color, minPrice, maxPrice): delegates to JPQL query
    │           │   │                         - getAuctionProducts(): returns isAuction=true only
    │           │   │                         - update(): finds existing → updates all fields → saves
    │           │   │                         - delete(): checks exists → deletes or throws 404
    │           │   │
    │           │   ├── BidService.java       Contains:
    │           │   │                         - placeBid(): @Transactional
    │           │   │                           1. Validates auction exists + status is ACTIVE
    │           │   │                           2. Validates endTime not passed
    │           │   │                           3. Validates user exists
    │           │   │                           4. Gets current highest bid (or basePrice if no bids yet)
    │           │   │                           5. Throws BadRequestException if amount <= currentHighest
    │           │   │                           6. Saves new Bid to PostgreSQL
    │           │   │                         - getHighestBid(): returns highest amount or basePrice
    │           │   │                         - getLeaderboard(): returns top 3 bids
    │           │   │                         - getAllBids(): returns all bids for auction sorted by amount
    │           │   │
    │           │   ├── CartService.java      Contains:
    │           │   │                         - getOrCreateCart(): finds cart by userId or creates new one
    │           │   │                         - addItem(): @Transactional
    │           │   │                           • If same product+size exists → increment quantity
    │           │   │                           • Else → create new CartItem and add to cart
    │           │   │                         - removeItem(): validates item belongs to user's cart → removes
    │           │   │                         - updateQuantity(): validates qty >= 1 → updates
    │           │   │                         - clearCart(): removes all items from cart
    │           │   │
    │           │   ├── WishlistService.java  Contains:
    │           │   │                         - getWishlist(): returns all wishlist entries for user
    │           │   │                         - addToWishlist(): checks duplicate → saves new entry
    │           │   │                         - removeFromWishlist(): checks exists → deletes by userId+productId
    │           │   │
    │           │   └── OrderService.java     Contains:
    │           │                             - placeOrder(): @Transactional
    │           │                               1. Gets user from DB
    │           │                               2. Gets user's cart (throws if empty)
    │           │                               3. Builds Order entity with address + payment
    │           │                               4. Converts each CartItem → OrderItem
    │           │                                  (stores priceAtPurchase snapshot)
    │           │                               5. Calculates totalPrice = sum(price × qty)
    │           │                               6. Saves Order to PostgreSQL
    │           │                               7. Clears cart after successful order
    │           │                             - getOrderHistory(): returns orders newest first
    │           │                             - getById(): finds order or throws 404
    │           │                             - updateStatus(): changes order status (PROCESSING→SHIPPED→DELIVERED)
    │           │
    │           ├── controller/
    │           │   ├── UserController.java   REST endpoints:
    │           │   │                         POST   /api/users/register  → register new user
    │           │   │                         POST   /api/users/login     → login, returns user info
    │           │   │                         GET    /api/users/{id}      → get user by ID
    │           │   │
    │           │   ├── ProductController.java REST endpoints:
    │           │   │                         GET    /api/products                          → all products
    │           │   │                         GET    /api/products/{id}                     → single product
    │           │   │                         GET    /api/products/filter?color=&min=&max=  → filtered products
    │           │   │                         GET    /api/products/auction                  → auction products only
    │           │   │                         POST   /api/products                          → add product
    │           │   │                         PUT    /api/products/{id}                     → update product
    │           │   │                         DELETE /api/products/{id}                     → delete product
    │           │   │
    │           │   ├── BidController.java    REST endpoints:
    │           │   │                         POST   /api/auctions/{id}/bids            → place bid (validates > current)
    │           │   │                         GET    /api/auctions/{id}/bids/highest    → current highest bid amount
    │           │   │                         GET    /api/auctions/{id}/bids/leaderboard → top 3 bidders
    │           │   │                         GET    /api/auctions/{id}/bids            → all bids for auction
    │           │   │
    │           │   ├── CartController.java   REST endpoints:
    │           │   │                         GET    /api/cart/{userId}                      → get or create cart
    │           │   │                         POST   /api/cart/{userId}/items                → add item to cart
    │           │   │                         DELETE /api/cart/{userId}/items/{cartItemId}   → remove item
    │           │   │                         PATCH  /api/cart/{userId}/items/{cartItemId}   → update quantity
    │           │   │                         DELETE /api/cart/{userId}/clear                → clear entire cart
    │           │   │
    │           │   ├── WishlistController.java REST endpoints:
    │           │   │                         GET    /api/wishlist/{userId}                        → get wishlist
    │           │   │                         POST   /api/wishlist/{userId}/products/{productId}   → add to wishlist
    │           │   │                         DELETE /api/wishlist/{userId}/products/{productId}   → remove from wishlist
    │           │   │
    │           │   └── OrderController.java  REST endpoints:
    │           │                             POST   /api/orders                    → place order from cart
    │           │                             GET    /api/orders/user/{userId}      → order history (newest first)
    │           │                             GET    /api/orders/{orderId}          → single order details
    │           │                             PATCH  /api/orders/{orderId}/status   → update order status
    │           │
    │           └── exception/
    │               ├── ResourceNotFoundException.java  Thrown when: entity not found by ID
    │               │                                   HTTP response: 404 Not Found
    │               │
    │               ├── BadRequestException.java        Thrown when: duplicate email, bid too low,
    │               │                                   empty cart, invalid auction status
    │               │                                   HTTP response: 400 Bad Request
    │               │
    │               └── GlobalExceptionHandler.java     @RestControllerAdvice — catches all exceptions
    │                                                   Returns JSON: { timestamp, status, error }
    │                                                   Handles: ResourceNotFoundException → 404
    │                                                            BadRequestException → 400
    │                                                            MethodArgumentNotValidException → 400
    │                                                            Exception (any other) → 500
    │
    │
    ├── api-gateway/                          Spring Cloud Gateway — routes traffic (config only, no Java files)
    │   ├── pom.xml                           Dependencies: spring-cloud-gateway, eureka-client
    │   ├── Dockerfile
    │   └── src/main/resources/
    │       └── application.yml               Routes:
    │                                         /api/auth/**     → auth-service:8081
    │                                         /api/products/** → product-service:8082
    │                                         /api/orders/**   → order-service:8083
    │                                         /api/bids/**     → bidding-service:8084
    │                                         CORS: allows localhost:5173
    │
    ├── auth-service/                         JWT auth microservice (config only, no Java files yet)
    │   ├── pom.xml                           Dependencies: spring-security, jjwt, jpa, postgresql, lombok
    │   ├── Dockerfile
    │   └── src/main/resources/
    │       └── application.yml               Port: 8081, DB: sneakcart_auth
    │                                         JWT secret + 24h expiry config
    │
    ├── product-service/                      Product microservice (config only, no Java files yet)
    │   ├── pom.xml                           Dependencies: jpa, postgresql, lombok
    │   ├── Dockerfile
    │   └── src/main/resources/
    │       └── application.yml               Port: 8082, DB: sneakcart_products
    │
    ├── order-service/                        Order microservice (config only, no Java files yet)
    │   ├── pom.xml                           Dependencies: jpa, postgresql, lombok
    │   ├── Dockerfile
    │   └── src/main/resources/
    │       └── application.yml               Port: 8083, DB: sneakcart_orders
    │
    └── bidding-service/                      Bidding microservice (config only, no Java files yet)
        ├── pom.xml                           Dependencies: jpa, websocket, redis, kafka, postgresql, lombok
        ├── Dockerfile
        └── src/main/resources/
            └── application.yml               Port: 8084, DB: sneakcart_bids
                                              Redis: localhost:6379
                                              Kafka: localhost:9092
                                              Kafka topics: bid-placed (3 partitions), bid-placed.DLT


```

---

## Features

### Frontend
| Page | Description |
|------|-------------|
| Home | Hero banner, category grid, 8 featured products |
| Products | 25 shoes with price range + color filters |
| Product Detail | Size selection, Add to Cart, Buy Now, recommended shoes |
| Trends | 15 live auction cards with countdown timers |
| Auction | Real-time bidding, leaderboard, bid validation |
| Cart | Qty controls, INR pricing, localStorage persistence |
| Wishlist | Save/remove items, localStorage persistence |
| Checkout | 4-step flow: Address → Payment (UPI/COD) → Preview → Confirm |
| Orders | Order history with address, payment method, recommendations |

### Backend
- JWT authentication with BCrypt password hashing
- Product filtering by price range and color
- Order placement and history
- Real-time bid updates via WebSocket
- Redis atomic bid validation (race condition prevention)
- Kafka async bid persistence with DLQ + 3x retry
- Redis fallback to DB on failure

---

## Quick Start

### Option 1 — Docker (recommended)

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8080 |
| Auth Service | http://localhost:8081 |
| Product Service | http://localhost:8082 |
| Order Service | http://localhost:8083 |
| Bidding Service | http://localhost:8084 |

---

### Option 2 — Local Development

**Prerequisites:** Node 20+, Java 17+, Maven, PostgreSQL, Redis, Kafka

**1. Start infrastructure**
```bash
docker-compose up postgres redis kafka zookeeper -d
```

**2. Run backend services** (each in a separate terminal)
```bash
cd backend/auth-service    && mvn spring-boot:run
cd backend/product-service && mvn spring-boot:run
cd backend/order-service   && mvn spring-boot:run
cd backend/bidding-service && mvn spring-boot:run
cd backend/api-gateway     && mvn spring-boot:run
```

**3. Run frontend**
```bash
cd frontend/sneaker-marketplace
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/register` | `{ name, email, password }` |
| POST | `/login` | `{ email, password }` |

### Products — `/api/products`
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/` | All products |
| GET | `/filter?color=&minPrice=&maxPrice=` | Filtered |
| GET | `/auction` | Auction-only products |
| POST | `/` | Add product |
| PUT | `/:id` | Update product |
| DELETE | `/:id` | Delete product |

### Orders — `/api/orders`
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/` | Place order |
| GET | `/user/:userId` | Order history |

### Bids — `/api/bids`
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/` | Place bid |
| GET | `/:auctionId/highest` | Current highest bid |
| GET | `/:auctionId/leaderboard` | Top 3 bidders |

### WebSocket
```
Endpoint:  ws://localhost:8084/ws  (SockJS)
Subscribe: /topic/auction/:auctionId
Message:   { auctionId, userId, userName, amount }
```

---

## Environment Variables

Create a `.env` file for production (see `.env.example`):

```env
POSTGRES_PASSWORD=your_strong_password
JWT_SECRET=your_256_bit_secret_key
REDIS_HOST=redis
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, plain CSS |
| State | React Context + localStorage |
| Backend | Spring Boot 3.2, Spring Cloud Gateway |
| Auth | JWT (jjwt), BCrypt |
| Database | PostgreSQL 16 (JPA / Hibernate) |
| Cache | Redis 7 |
| Messaging | Apache Kafka |
| Real-time | WebSocket (STOMP + SockJS) |
| Container | Docker + Docker Compose |
| Web Server | Nginx (frontend production) |

---

## System Design

See [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) for:
- Architecture diagram
- Data flow (purchase + auction)
- Redis concurrency model
- Failure handling table
- Scaling strategy

---

## Screenshots

> Add screenshots here after running the project locally.

---

## License

MIT
