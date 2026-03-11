export type Locale = "en" | "ur" | "ar" | "fr";

export const LOCALES: { code: Locale; name: string; dir: "ltr" | "rtl"; flag: string }[] = [
  { code: "en", name: "English", dir: "ltr", flag: "GB" },
  { code: "ur", name: "Urdu", dir: "rtl", flag: "PK" },
  { code: "ar", name: "Arabic", dir: "rtl", flag: "SA" },
  { code: "fr", name: "French", dir: "ltr", flag: "FR" },
];

export const CURRENCIES: Record<Locale, { code: string; symbol: string; rate: number }> = {
  en: { code: "USD", symbol: "$", rate: 1 },
  ur: { code: "PKR", symbol: "Rs", rate: 278.5 },
  ar: { code: "SAR", symbol: "SR", rate: 3.75 },
  fr: { code: "EUR", symbol: "\u20AC", rate: 0.92 },
};

export type CurrencyCode = "USD" | "PKR" | "EUR" | "GBP" | "SAR";

export const ALL_CURRENCIES: { code: CurrencyCode; symbol: string; rate: number; name: string; flag: string }[] = [
  { code: "USD", symbol: "$", rate: 1, name: "US Dollar", flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  { code: "PKR", symbol: "Rs", rate: 278.5, name: "Pakistani Rupee", flag: "\uD83C\uDDF5\uD83C\uDDF0" },
  { code: "EUR", symbol: "\u20AC", rate: 0.92, name: "Euro", flag: "\uD83C\uDDEA\uD83C\uDDFA" },
  { code: "GBP", symbol: "\u00A3", rate: 0.79, name: "British Pound", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  { code: "SAR", symbol: "SR", rate: 3.75, name: "Saudi Riyal", flag: "\uD83C\uDDF8\uD83C\uDDE6" },
];

type TranslationKeys = {
  // Navigation
  "nav.home": string;
  "nav.products": string;
  "nav.cart": string;
  "nav.wishlist": string;
  "nav.orders": string;
  "nav.profile": string;
  "nav.admin": string;
  "nav.faq": string;
  "nav.contact": string;
  "nav.signIn": string;
  "nav.signUp": string;
  "nav.bundles": string;
  "nav.registry": string;
  "nav.groupGift": string;
  "nav.shopTogether": string;
  "nav.more": string;

  // Home page
  "home.hero.title": string;
  "home.hero.subtitle": string;
  "home.hero.shopNow": string;
  "home.hero.browse": string;
  "home.categories.title": string;
  "home.categories.subtitle": string;
  "home.featured.title": string;
  "home.featured.subtitle": string;
  "home.featured.viewAll": string;
  "home.why.title": string;
  "home.why.curated": string;
  "home.why.curatedDesc": string;
  "home.why.delivery": string;
  "home.why.deliveryDesc": string;
  "home.why.secure": string;
  "home.why.secureDesc": string;

  // Products
  "products.title": string;
  "products.search": string;
  "products.noResults": string;
  "products.addToCart": string;
  "products.outOfStock": string;
  "products.inStock": string;
  "products.reviews": string;
  "products.description": string;

  // Cart
  "cart.title": string;
  "cart.empty": string;
  "cart.subtotal": string;
  "cart.checkout": string;
  "cart.remove": string;
  "cart.continueShopping": string;

  // Checkout
  "checkout.title": string;
  "checkout.shipping": string;
  "checkout.fullName": string;
  "checkout.phone": string;
  "checkout.address": string;
  "checkout.city": string;
  "checkout.giftMessage": string;
  "checkout.giftMessagePlaceholder": string;
  "checkout.fontStyle": string;
  "checkout.discount": string;
  "checkout.apply": string;
  "checkout.remove": string;
  "checkout.orderSummary": string;
  "checkout.total": string;
  "checkout.shipping_free": string;
  "checkout.placeOrder": string;
  "checkout.payment": string;
  "checkout.giftWrapping": string;
  "checkout.selectWrapping": string;
  "checkout.packaging": string;
  "checkout.selectPackaging": string;
  "checkout.charity": string;
  "checkout.selectCharity": string;
  "checkout.donatePercent": string;
  "checkout.scheduledDelivery": string;
  "checkout.selectDate": string;
  "checkout.multiDestination": string;
  "checkout.addRecipient": string;

  // Orders
  "orders.title": string;
  "orders.noOrders": string;
  "orders.trackOrder": string;
  "orders.status": string;
  "orders.orderDate": string;

  // Wishlist
  "wishlist.title": string;
  "wishlist.empty": string;
  "wishlist.addToCart": string;

  // Reviews
  "reviews.title": string;
  "reviews.writeReview": string;
  "reviews.noReviews": string;
  "reviews.submit": string;

  // Footer
  "footer.rights": string;
  "footer.about": string;
  "footer.privacy": string;
  "footer.terms": string;

  // Common
  "common.loading": string;
  "common.error": string;
  "common.save": string;
  "common.cancel": string;
  "common.delete": string;
  "common.edit": string;
  "common.create": string;
  "common.search": string;
  "common.filter": string;
  "common.all": string;
  "common.active": string;
  "common.inactive": string;
  "common.yes": string;
  "common.no": string;
  "common.back": string;
  "common.next": string;
  "common.previous": string;
  "common.viewDetails": string;

  // New features
  "bundles.title": string;
  "bundles.occasion": string;
  "bundles.createCustom": string;
  "bundles.items": string;
  "bundles.totalValue": string;
  "bundles.bundlePrice": string;
  "bundles.youSave": string;

  "registry.title": string;
  "registry.create": string;
  "registry.eventName": string;
  "registry.eventDate": string;
  "registry.eventType": string;
  "registry.shareLink": string;
  "registry.addItems": string;
  "registry.purchased": string;
  "registry.remaining": string;

  "groupGift.title": string;
  "groupGift.create": string;
  "groupGift.contribute": string;
  "groupGift.funded": string;
  "groupGift.progress": string;
  "groupGift.shareLink": string;
  "groupGift.contributors": string;

  "social.title": string;
  "social.createSession": string;
  "social.joinSession": string;
  "social.enterCode": string;
  "social.participants": string;
  "social.shareProduct": string;
  "social.sendMessage": string;

  "charity.title": string;
  "charity.donateWith": string;
  "charity.totalDonated": string;
};

const en: TranslationKeys = {
  "nav.home": "Home",
  "nav.products": "Products",
  "nav.cart": "Cart",
  "nav.wishlist": "Wishlist",
  "nav.orders": "My Orders",
  "nav.profile": "Profile",
  "nav.admin": "Admin",
  "nav.faq": "FAQ",
  "nav.contact": "Contact",
  "nav.signIn": "Sign In",
  "nav.signUp": "Sign Up",
  "nav.bundles": "Bundles",
  "nav.registry": "Registry",
  "nav.groupGift": "Group Gift",
  "nav.shopTogether": "Shop Together",
  "nav.more": "More",

  "home.hero.title": "Welcome to Gift Gallery",
  "home.hero.subtitle": "Discover the perfect gifts for every occasion. From jewelry to watches, perfumes to accessories \u2014 find something special for everyone.",
  "home.hero.shopNow": "Shop Now",
  "home.hero.browse": "Browse Categories",
  "home.categories.title": "Shop by Category",
  "home.categories.subtitle": "Find the perfect gift from our curated collections",
  "home.featured.title": "Featured Products",
  "home.featured.subtitle": "Our most popular gifts loved by customers",
  "home.featured.viewAll": "View All Products",
  "home.why.title": "Why Choose Gift Gallery",
  "home.why.curated": "Curated Gifts",
  "home.why.curatedDesc": "Handpicked products for every occasion and every budget.",
  "home.why.delivery": "Fast Delivery",
  "home.why.deliveryDesc": "Quick and reliable shipping to your doorstep.",
  "home.why.secure": "Secure Shopping",
  "home.why.secureDesc": "Safe and secure checkout with easy returns.",

  "products.title": "All Products",
  "products.search": "Search products...",
  "products.noResults": "No products found",
  "products.addToCart": "Add to Cart",
  "products.outOfStock": "Out of Stock",
  "products.inStock": "In Stock",
  "products.reviews": "Reviews",
  "products.description": "Description",

  "cart.title": "Shopping Cart",
  "cart.empty": "Your cart is empty",
  "cart.subtotal": "Subtotal",
  "cart.checkout": "Proceed to Checkout",
  "cart.remove": "Remove",
  "cart.continueShopping": "Continue Shopping",

  "checkout.title": "Checkout",
  "checkout.shipping": "Shipping Details",
  "checkout.fullName": "Full Name",
  "checkout.phone": "Phone Number",
  "checkout.address": "Address",
  "checkout.city": "City",
  "checkout.giftMessage": "Gift Message (Optional)",
  "checkout.giftMessagePlaceholder": "Write a heartfelt message for the recipient...",
  "checkout.fontStyle": "Font Style",
  "checkout.discount": "Discount Code",
  "checkout.apply": "Apply",
  "checkout.remove": "Remove",
  "checkout.orderSummary": "Order Summary",
  "checkout.total": "Total",
  "checkout.shipping_free": "Free",
  "checkout.placeOrder": "Continue to Payment",
  "checkout.payment": "Payment",
  "checkout.giftWrapping": "Gift Wrapping",
  "checkout.selectWrapping": "Select a wrapping style",
  "checkout.packaging": "Gift Packaging",
  "checkout.selectPackaging": "Select packaging",
  "checkout.charity": "Donate to Charity",
  "checkout.selectCharity": "Select a charity",
  "checkout.donatePercent": "Donation percentage",
  "checkout.scheduledDelivery": "Schedule Delivery",
  "checkout.selectDate": "Select delivery date",
  "checkout.multiDestination": "Multiple Destinations",
  "checkout.addRecipient": "Add Recipient",

  "orders.title": "My Orders",
  "orders.noOrders": "You haven't placed any orders yet",
  "orders.trackOrder": "Track Order",
  "orders.status": "Status",
  "orders.orderDate": "Order Date",

  "wishlist.title": "My Wishlist",
  "wishlist.empty": "Your wishlist is empty",
  "wishlist.addToCart": "Add to Cart",

  "reviews.title": "Customer Reviews",
  "reviews.writeReview": "Write a Review",
  "reviews.noReviews": "No reviews yet. Be the first to review!",
  "reviews.submit": "Submit Review",

  "footer.rights": "All rights reserved",
  "footer.about": "About Us",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",

  "common.loading": "Loading...",
  "common.error": "An error occurred",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.create": "Create",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.all": "All",
  "common.active": "Active",
  "common.inactive": "Inactive",
  "common.yes": "Yes",
  "common.no": "No",
  "common.back": "Back",
  "common.next": "Next",
  "common.previous": "Previous",
  "common.viewDetails": "View Details",

  "bundles.title": "Gift Bundles",
  "bundles.occasion": "Occasion",
  "bundles.createCustom": "Create Custom Bundle",
  "bundles.items": "Items in Bundle",
  "bundles.totalValue": "Total Value",
  "bundles.bundlePrice": "Bundle Price",
  "bundles.youSave": "You Save",

  "registry.title": "Gift Registry",
  "registry.create": "Create Registry",
  "registry.eventName": "Event Name",
  "registry.eventDate": "Event Date",
  "registry.eventType": "Event Type",
  "registry.shareLink": "Share Link",
  "registry.addItems": "Add Items",
  "registry.purchased": "Purchased",
  "registry.remaining": "Remaining",

  "groupGift.title": "Group Gifting",
  "groupGift.create": "Start a Group Gift",
  "groupGift.contribute": "Contribute",
  "groupGift.funded": "Fully Funded!",
  "groupGift.progress": "Progress",
  "groupGift.shareLink": "Share with Friends",
  "groupGift.contributors": "Contributors",

  "social.title": "Shop Together",
  "social.createSession": "Create Shopping Session",
  "social.joinSession": "Join Session",
  "social.enterCode": "Enter session code",
  "social.participants": "Participants",
  "social.shareProduct": "Share Product",
  "social.sendMessage": "Send Message",

  "charity.title": "Charity Partners",
  "charity.donateWith": "Donate with your purchase",
  "charity.totalDonated": "Total Donated",
};

const ur: TranslationKeys = {
  "nav.home": "\u06C1\u0648\u0645",
  "nav.products": "\u0645\u0635\u0646\u0648\u0639\u0627\u062A",
  "nav.cart": "\u06A9\u0627\u0631\u0679",
  "nav.wishlist": "\u062E\u0648\u0627\u06C1\u0634\u0627\u062A \u06A9\u06CC \u0641\u06C1\u0631\u0633\u062A",
  "nav.orders": "\u0645\u06CC\u0631\u06D2 \u0622\u0631\u0688\u0631\u0632",
  "nav.profile": "\u067E\u0631\u0648\u0641\u0627\u0626\u0644",
  "nav.admin": "\u0627\u06CC\u0688\u0645\u0646",
  "nav.faq": "\u0639\u0627\u0645 \u0633\u0648\u0627\u0644\u0627\u062A",
  "nav.contact": "\u0631\u0627\u0628\u0637\u06C1 \u06A9\u0631\u06CC\u06BA",
  "nav.signIn": "\u0633\u0627\u0626\u0646 \u0627\u0646",
  "nav.signUp": "\u0633\u0627\u0626\u0646 \u0627\u067E",
  "nav.bundles": "\u0628\u0646\u0688\u0644",
  "nav.registry": "\u0631\u062C\u0633\u0679\u0631\u06CC",
  "nav.groupGift": "\u06AF\u0631\u0648\u067E \u062A\u062D\u0641\u06C1",
  "nav.shopTogether": "\u0633\u0627\u062A\u06BE \u062E\u0631\u06CC\u062F\u06CC\u06BA",
  "nav.more": "\u0645\u0632\u06CC\u062F",

  "home.hero.title": "\u06AF\u0641\u0679 \u06AF\u06CC\u0644\u0631\u06CC \u0645\u06CC\u06BA \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F",
  "home.hero.subtitle": "\u06C1\u0631 \u0645\u0648\u0642\u0639 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0628\u06C1\u062A\u0631\u06CC\u0646 \u062A\u062D\u0627\u0626\u0641 \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0631\u06CC\u06BA\u06D4 \u0632\u06CC\u0648\u0631\u0627\u062A \u0633\u06D2 \u06AF\u06BE\u0691\u06CC\u0627\u06BA\u060C \u0639\u0637\u0631 \u0633\u06D2 \u0644\u0648\u0627\u0632\u0645\u0627\u062A \u062A\u06A9\u06D4",
  "home.hero.shopNow": "\u0627\u0628\u06BE\u06CC \u062E\u0631\u06CC\u062F\u06CC\u06BA",
  "home.hero.browse": "\u0632\u0645\u0631\u06D2 \u062F\u06CC\u06A9\u06BE\u06CC\u06BA",
  "home.categories.title": "\u0632\u0645\u0631\u06D2 \u06A9\u06D2 \u0645\u0637\u0627\u0628\u0642 \u062E\u0631\u06CC\u062F\u06CC\u06BA",
  "home.categories.subtitle": "\u06C1\u0645\u0627\u0631\u06D2 \u0645\u0646\u062A\u062E\u0628 \u0645\u062C\u0645\u0648\u0639\u0648\u06BA \u0633\u06D2 \u0628\u06C1\u062A\u0631\u06CC\u0646 \u062A\u062D\u0641\u06C1 \u062A\u0644\u0627\u0634 \u06A9\u0631\u06CC\u06BA",
  "home.featured.title": "\u0646\u0645\u0627\u06CC\u0627\u06BA \u0645\u0635\u0646\u0648\u0639\u0627\u062A",
  "home.featured.subtitle": "\u06C1\u0645\u0627\u0631\u06D2 \u0633\u0628 \u0633\u06D2 \u0645\u0642\u0628\u0648\u0644 \u062A\u062D\u0627\u0626\u0641",
  "home.featured.viewAll": "\u062A\u0645\u0627\u0645 \u0645\u0635\u0646\u0648\u0639\u0627\u062A \u062F\u06CC\u06A9\u06BE\u06CC\u06BA",
  "home.why.title": "\u06AF\u0641\u0679 \u06AF\u06CC\u0644\u0631\u06CC \u06A9\u06CC\u0648\u06BA \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
  "home.why.curated": "\u0645\u0646\u062A\u062E\u0628 \u062A\u062D\u0627\u0626\u0641",
  "home.why.curatedDesc": "\u06C1\u0631 \u0645\u0648\u0642\u0639 \u0627\u0648\u0631 \u06C1\u0631 \u0628\u062C\u0679 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0645\u0646\u062A\u062E\u0628 \u0645\u0635\u0646\u0648\u0639\u0627\u062A\u06D4",
  "home.why.delivery": "\u062A\u06CC\u0632 \u062A\u0631\u0633\u06CC\u0644",
  "home.why.deliveryDesc": "\u0622\u067E \u06A9\u06D2 \u062F\u0631\u0648\u0627\u0632\u06D2 \u062A\u06A9 \u062A\u06CC\u0632 \u0627\u0648\u0631 \u0642\u0627\u0628\u0644 \u0627\u0639\u062A\u0645\u0627\u062F \u062A\u0631\u0633\u06CC\u0644\u06D4",
  "home.why.secure": "\u0645\u062D\u0641\u0648\u0638 \u062E\u0631\u06CC\u062F\u0627\u0631\u06CC",
  "home.why.secureDesc": "\u0645\u062D\u0641\u0648\u0638 \u0686\u06CC\u06A9 \u0627\u0627\u0624\u0679 \u0627\u0648\u0631 \u0622\u0633\u0627\u0646 \u0648\u0627\u067E\u0633\u06CC\u06D4",

  "products.title": "\u062A\u0645\u0627\u0645 \u0645\u0635\u0646\u0648\u0639\u0627\u062A",
  "products.search": "\u0645\u0635\u0646\u0648\u0639\u0627\u062A \u062A\u0644\u0627\u0634 \u06A9\u0631\u06CC\u06BA...",
  "products.noResults": "\u06A9\u0648\u0626\u06CC \u0645\u0635\u0646\u0648\u0639\u0627\u062A \u0646\u06C1\u06CC\u06BA \u0645\u0644\u06CC\u06BA",
  "products.addToCart": "\u06A9\u0627\u0631\u0679 \u0645\u06CC\u06BA \u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA",
  "products.outOfStock": "\u0633\u0679\u0627\u06A9 \u0645\u06CC\u06BA \u0646\u06C1\u06CC\u06BA",
  "products.inStock": "\u062F\u0633\u062A\u06CC\u0627\u0628",
  "products.reviews": "\u062C\u0627\u0626\u0632\u06D2",
  "products.description": "\u062A\u0641\u0635\u06CC\u0644",

  "cart.title": "\u0634\u0627\u067E\u0646\u06AF \u06A9\u0627\u0631\u0679",
  "cart.empty": "\u0622\u067E \u06A9\u0627 \u06A9\u0627\u0631\u0679 \u062E\u0627\u0644\u06CC \u06C1\u06D2",
  "cart.subtotal": "\u0630\u06CC\u0644\u06CC \u06A9\u0644",
  "cart.checkout": "\u0686\u06CC\u06A9 \u0627\u0627\u0624\u0679 \u06A9\u0631\u06CC\u06BA",
  "cart.remove": "\u06C1\u0679\u0627\u0626\u06CC\u06BA",
  "cart.continueShopping": "\u062E\u0631\u06CC\u062F\u0627\u0631\u06CC \u062C\u0627\u0631\u06CC \u0631\u06A9\u06BE\u06CC\u06BA",

  "checkout.title": "\u0686\u06CC\u06A9 \u0627\u0627\u0624\u0679",
  "checkout.shipping": "\u062A\u0631\u0633\u06CC\u0644 \u06A9\u06CC \u062A\u0641\u0635\u06CC\u0644\u0627\u062A",
  "checkout.fullName": "\u067E\u0648\u0631\u0627 \u0646\u0627\u0645",
  "checkout.phone": "\u0641\u0648\u0646 \u0646\u0645\u0628\u0631",
  "checkout.address": "\u067E\u062A\u06C1",
  "checkout.city": "\u0634\u06C1\u0631",
  "checkout.giftMessage": "\u062A\u062D\u0641\u06D2 \u06A9\u0627 \u067E\u06CC\u063A\u0627\u0645 (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC)",
  "checkout.giftMessagePlaceholder": "\u0648\u0635\u0648\u0644 \u06A9\u0646\u0646\u062F\u06C1 \u06A9\u06D2 \u0644\u06CC\u06D2 \u062F\u0644\u06CC \u067E\u06CC\u063A\u0627\u0645 \u0644\u06A9\u06BE\u06CC\u06BA...",
  "checkout.fontStyle": "\u0641\u0627\u0646\u0679 \u0627\u0633\u0679\u0627\u0626\u0644",
  "checkout.discount": "\u0688\u0633\u06A9\u0627\u0624\u0646\u0679 \u06A9\u0648\u0688",
  "checkout.apply": "\u0644\u0627\u06AF\u0648 \u06A9\u0631\u06CC\u06BA",
  "checkout.remove": "\u06C1\u0679\u0627\u0626\u06CC\u06BA",
  "checkout.orderSummary": "\u0622\u0631\u0688\u0631 \u06A9\u0627 \u062E\u0644\u0627\u0635\u06C1",
  "checkout.total": "\u06A9\u0644",
  "checkout.shipping_free": "\u0645\u0641\u062A",
  "checkout.placeOrder": "\u0627\u062F\u0627\u0626\u06CC\u06AF\u06CC \u062C\u0627\u0631\u06CC \u0631\u06A9\u06BE\u06CC\u06BA",
  "checkout.payment": "\u0627\u062F\u0627\u0626\u06CC\u06AF\u06CC",
  "checkout.giftWrapping": "\u062A\u062D\u0641\u06D2 \u06A9\u06CC \u067E\u06CC\u06A9\u0646\u06AF",
  "checkout.selectWrapping": "\u067E\u06CC\u06A9\u0646\u06AF \u0627\u0633\u0679\u0627\u0626\u0644 \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
  "checkout.packaging": "\u062A\u062D\u0641\u06D2 \u06A9\u06CC \u067E\u06CC\u06A9\u06CC\u062C\u0646\u06AF",
  "checkout.selectPackaging": "\u067E\u06CC\u06A9\u06CC\u062C\u0646\u06AF \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
  "checkout.charity": "\u062E\u06CC\u0631\u0627\u062A \u0645\u06CC\u06BA \u0639\u0637\u06CC\u06C1",
  "checkout.selectCharity": "\u062E\u06CC\u0631\u0627\u062A\u06CC \u0627\u062F\u0627\u0631\u06C1 \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
  "checkout.donatePercent": "\u0639\u0637\u06CC\u06D2 \u06A9\u06CC \u0641\u06CC\u0635\u062F",
  "checkout.scheduledDelivery": "\u062A\u0631\u0633\u06CC\u0644 \u06A9\u0627 \u0634\u06CC\u0688\u06CC\u0648\u0644",
  "checkout.selectDate": "\u062A\u0631\u0633\u06CC\u0644 \u06A9\u06CC \u062A\u0627\u0631\u06CC\u062E \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
  "checkout.multiDestination": "\u0645\u062A\u0639\u062F\u062F \u0645\u0646\u0632\u0644\u06CC\u06BA",
  "checkout.addRecipient": "\u0648\u0635\u0648\u0644 \u06A9\u0646\u0646\u062F\u06C1 \u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA",

  "orders.title": "\u0645\u06CC\u0631\u06D2 \u0622\u0631\u0688\u0631\u0632",
  "orders.noOrders": "\u0622\u067E \u0646\u06D2 \u0627\u0628\u06BE\u06CC \u062A\u06A9 \u06A9\u0648\u0626\u06CC \u0622\u0631\u0688\u0631 \u0646\u06C1\u06CC\u06BA \u062F\u06CC\u0627",
  "orders.trackOrder": "\u0622\u0631\u0688\u0631 \u0679\u0631\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA",
  "orders.status": "\u062D\u0627\u0644\u062A",
  "orders.orderDate": "\u0622\u0631\u0688\u0631 \u06A9\u06CC \u062A\u0627\u0631\u06CC\u062E",

  "wishlist.title": "\u0645\u06CC\u0631\u06CC \u062E\u0648\u0627\u06C1\u0634\u0627\u062A \u06A9\u06CC \u0641\u06C1\u0631\u0633\u062A",
  "wishlist.empty": "\u0622\u067E \u06A9\u06CC \u062E\u0648\u0627\u06C1\u0634\u0627\u062A \u06A9\u06CC \u0641\u06C1\u0631\u0633\u062A \u062E\u0627\u0644\u06CC \u06C1\u06D2",
  "wishlist.addToCart": "\u06A9\u0627\u0631\u0679 \u0645\u06CC\u06BA \u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA",

  "reviews.title": "\u0635\u0627\u0631\u0641\u06CC\u0646 \u06A9\u06D2 \u062C\u0627\u0626\u0632\u06D2",
  "reviews.writeReview": "\u062C\u0627\u0626\u0632\u06C1 \u0644\u06A9\u06BE\u06CC\u06BA",
  "reviews.noReviews": "\u0627\u0628\u06BE\u06CC \u062A\u06A9 \u06A9\u0648\u0626\u06CC \u062C\u0627\u0626\u0632\u06C1 \u0646\u06C1\u06CC\u06BA\u06D4 \u067E\u06C1\u0644\u06D2 \u062C\u0627\u0626\u0632\u06C1 \u062F\u06CC\u06BA!",
  "reviews.submit": "\u062C\u0627\u0626\u0632\u06C1 \u062C\u0645\u0639 \u06A9\u0631\u0627\u0626\u06CC\u06BA",

  "footer.rights": "\u062C\u0645\u0644\u06C1 \u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638 \u06C1\u06CC\u06BA",
  "footer.about": "\u06C1\u0645\u0627\u0631\u06D2 \u0628\u0627\u0631\u06D2 \u0645\u06CC\u06BA",
  "footer.privacy": "\u0631\u0627\u0632\u062F\u0627\u0631\u06CC \u06A9\u06CC \u067E\u0627\u0644\u06CC\u0633\u06CC",
  "footer.terms": "\u0634\u0631\u0627\u0626\u0637 \u0648 \u0636\u0648\u0627\u0628\u0637",

  "common.loading": "\u0644\u0648\u0688 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
  "common.error": "\u0627\u06CC\u06A9 \u062E\u0631\u0627\u0628\u06CC \u06C1\u0648\u0626\u06CC",
  "common.save": "\u0645\u062D\u0641\u0648\u0638 \u06A9\u0631\u06CC\u06BA",
  "common.cancel": "\u0645\u0646\u0633\u0648\u062E",
  "common.delete": "\u062D\u0630\u0641",
  "common.edit": "\u062A\u0631\u0645\u06CC\u0645",
  "common.create": "\u0628\u0646\u0627\u0626\u06CC\u06BA",
  "common.search": "\u062A\u0644\u0627\u0634",
  "common.filter": "\u0641\u0644\u0679\u0631",
  "common.all": "\u0633\u0628",
  "common.active": "\u0641\u0639\u0627\u0644",
  "common.inactive": "\u063A\u06CC\u0631 \u0641\u0639\u0627\u0644",
  "common.yes": "\u06C1\u0627\u06BA",
  "common.no": "\u0646\u06C1\u06CC\u06BA",
  "common.back": "\u0648\u0627\u067E\u0633",
  "common.next": "\u0627\u06AF\u0644\u0627",
  "common.previous": "\u067E\u0686\u06BE\u0644\u0627",
  "common.viewDetails": "\u062A\u0641\u0635\u06CC\u0644\u0627\u062A \u062F\u06CC\u06A9\u06BE\u06CC\u06BA",

  "bundles.title": "\u062A\u062D\u0641\u06D2 \u06A9\u06D2 \u0628\u0646\u0688\u0644",
  "bundles.occasion": "\u0645\u0648\u0642\u0639",
  "bundles.createCustom": "\u0627\u067E\u0646\u06CC \u0645\u0631\u0636\u06CC \u06A9\u0627 \u0628\u0646\u0688\u0644 \u0628\u0646\u0627\u0626\u06CC\u06BA",
  "bundles.items": "\u0628\u0646\u0688\u0644 \u0645\u06CC\u06BA \u0627\u0634\u06CC\u0627\u0621",
  "bundles.totalValue": "\u06A9\u0644 \u0642\u06CC\u0645\u062A",
  "bundles.bundlePrice": "\u0628\u0646\u0688\u0644 \u0642\u06CC\u0645\u062A",
  "bundles.youSave": "\u0622\u067E \u0628\u0686\u0627\u0626\u06CC\u06BA",

  "registry.title": "\u062A\u062D\u0641\u06D2 \u06A9\u06CC \u0631\u062C\u0633\u0679\u0631\u06CC",
  "registry.create": "\u0631\u062C\u0633\u0679\u0631\u06CC \u0628\u0646\u0627\u0626\u06CC\u06BA",
  "registry.eventName": "\u062A\u0642\u0631\u06CC\u0628 \u06A9\u0627 \u0646\u0627\u0645",
  "registry.eventDate": "\u062A\u0642\u0631\u06CC\u0628 \u06A9\u06CC \u062A\u0627\u0631\u06CC\u062E",
  "registry.eventType": "\u062A\u0642\u0631\u06CC\u0628 \u06A9\u06CC \u0642\u0633\u0645",
  "registry.shareLink": "\u0644\u0646\u06A9 \u0634\u06CC\u0626\u0631 \u06A9\u0631\u06CC\u06BA",
  "registry.addItems": "\u0627\u0634\u06CC\u0627\u0621 \u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA",
  "registry.purchased": "\u062E\u0631\u06CC\u062F\u0627",
  "registry.remaining": "\u0628\u0627\u0642\u06CC",

  "groupGift.title": "\u06AF\u0631\u0648\u067E \u062A\u062D\u0641\u06C1",
  "groupGift.create": "\u06AF\u0631\u0648\u067E \u062A\u062D\u0641\u06C1 \u0634\u0631\u0648\u0639 \u06A9\u0631\u06CC\u06BA",
  "groupGift.contribute": "\u062D\u0635\u06C1 \u0688\u0627\u0644\u06CC\u06BA",
  "groupGift.funded": "\u0645\u06A9\u0645\u0644 \u0641\u0646\u0688!",
  "groupGift.progress": "\u067E\u06CC\u0634\u0631\u0641\u062A",
  "groupGift.shareLink": "\u062F\u0648\u0633\u062A\u0648\u06BA \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0634\u06CC\u0626\u0631 \u06A9\u0631\u06CC\u06BA",
  "groupGift.contributors": "\u062D\u0635\u06C1 \u062F\u0627\u0631",

  "social.title": "\u0633\u0627\u062A\u06BE \u062E\u0631\u06CC\u062F\u0627\u0631\u06CC \u06A9\u0631\u06CC\u06BA",
  "social.createSession": "\u062E\u0631\u06CC\u062F\u0627\u0631\u06CC \u0633\u06CC\u0634\u0646 \u0628\u0646\u0627\u0626\u06CC\u06BA",
  "social.joinSession": "\u0633\u06CC\u0634\u0646 \u0645\u06CC\u06BA \u0634\u0627\u0645\u0644 \u06C1\u0648\u06BA",
  "social.enterCode": "\u0633\u06CC\u0634\u0646 \u06A9\u0648\u0688 \u062F\u0631\u062C \u06A9\u0631\u06CC\u06BA",
  "social.participants": "\u0634\u0631\u06A9\u0627\u0621",
  "social.shareProduct": "\u0645\u0635\u0646\u0648\u0639\u06C1 \u0634\u06CC\u0626\u0631 \u06A9\u0631\u06CC\u06BA",
  "social.sendMessage": "\u067E\u06CC\u063A\u0627\u0645 \u0628\u06BE\u06CC\u062C\u06CC\u06BA",

  "charity.title": "\u062E\u06CC\u0631\u0627\u062A\u06CC \u0634\u0631\u0627\u06A9\u062A \u062F\u0627\u0631",
  "charity.donateWith": "\u0627\u067E\u0646\u06CC \u062E\u0631\u06CC\u062F \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0639\u0637\u06CC\u06C1 \u06A9\u0631\u06CC\u06BA",
  "charity.totalDonated": "\u06A9\u0644 \u0639\u0637\u06CC\u06C1",
};

const ar: TranslationKeys = {
  "nav.home": "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
  "nav.products": "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A",
  "nav.cart": "\u0627\u0644\u0633\u0644\u0629",
  "nav.wishlist": "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0623\u0645\u0646\u064A\u0627\u062A",
  "nav.orders": "\u0637\u0644\u0628\u0627\u062A\u064A",
  "nav.profile": "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A",
  "nav.admin": "\u0627\u0644\u0625\u062F\u0627\u0631\u0629",
  "nav.faq": "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629",
  "nav.contact": "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627",
  "nav.signIn": "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644",
  "nav.signUp": "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628",
  "nav.bundles": "\u062D\u0632\u0645 \u0627\u0644\u0647\u062F\u0627\u064A\u0627",
  "nav.registry": "\u0633\u062C\u0644 \u0627\u0644\u0647\u062F\u0627\u064A\u0627",
  "nav.groupGift": "\u0647\u062F\u064A\u0629 \u062C\u0645\u0627\u0639\u064A\u0629",
  "nav.shopTogether": "\u062A\u0633\u0648\u0642 \u0645\u0639\u0627",
  "nav.more": "\u0627\u0644\u0645\u0632\u064A\u062F",

  "home.hero.title": "\u0645\u0631\u062D\u0628\u0627 \u0628\u0643\u0645 \u0641\u064A \u0645\u0639\u0631\u0636 \u0627\u0644\u0647\u062F\u0627\u064A\u0627",
  "home.hero.subtitle": "\u0627\u0643\u062A\u0634\u0641 \u0627\u0644\u0647\u062F\u0627\u064A\u0627 \u0627\u0644\u0645\u062B\u0627\u0644\u064A\u0629 \u0644\u0643\u0644 \u0645\u0646\u0627\u0633\u0628\u0629. \u0645\u0646 \u0627\u0644\u0645\u062C\u0648\u0647\u0631\u0627\u062A \u0625\u0644\u0649 \u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0648\u0627\u0644\u0639\u0637\u0648\u0631 \u0648\u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A.",
  "home.hero.shopNow": "\u062A\u0633\u0648\u0642 \u0627\u0644\u0622\u0646",
  "home.hero.browse": "\u062A\u0635\u0641\u062D \u0627\u0644\u0641\u0626\u0627\u062A",
  "home.categories.title": "\u062A\u0633\u0648\u0642 \u062D\u0633\u0628 \u0627\u0644\u0641\u0626\u0629",
  "home.categories.subtitle": "\u0627\u0639\u062B\u0631 \u0639\u0644\u0649 \u0627\u0644\u0647\u062F\u064A\u0629 \u0627\u0644\u0645\u062B\u0627\u0644\u064A\u0629 \u0645\u0646 \u0645\u062C\u0645\u0648\u0639\u0627\u062A\u0646\u0627",
  "home.featured.title": "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0645\u064A\u0632\u0629",
  "home.featured.subtitle": "\u0623\u0643\u062B\u0631 \u0627\u0644\u0647\u062F\u0627\u064A\u0627 \u0634\u0639\u0628\u064A\u0629 \u0644\u062F\u0649 \u0639\u0645\u0644\u0627\u0626\u0646\u0627",
  "home.featured.viewAll": "\u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A",
  "home.why.title": "\u0644\u0645\u0627\u0630\u0627 \u062A\u062E\u062A\u0627\u0631 \u0645\u0639\u0631\u0636 \u0627\u0644\u0647\u062F\u0627\u064A\u0627",
  "home.why.curated": "\u0647\u062F\u0627\u064A\u0627 \u0645\u0646\u062A\u0642\u0627\u0629",
  "home.why.curatedDesc": "\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u062E\u062A\u0627\u0631\u0629 \u0628\u0639\u0646\u0627\u064A\u0629 \u0644\u0643\u0644 \u0645\u0646\u0627\u0633\u0628\u0629 \u0648\u0645\u064A\u0632\u0627\u0646\u064A\u0629.",
  "home.why.delivery": "\u062A\u0648\u0635\u064A\u0644 \u0633\u0631\u064A\u0639",
  "home.why.deliveryDesc": "\u0634\u062D\u0646 \u0633\u0631\u064A\u0639 \u0648\u0645\u0648\u062B\u0648\u0642 \u0625\u0644\u0649 \u0628\u0627\u0628\u0643.",
  "home.why.secure": "\u062A\u0633\u0648\u0642 \u0622\u0645\u0646",
  "home.why.secureDesc": "\u062F\u0641\u0639 \u0622\u0645\u0646 \u0648\u0625\u0631\u062C\u0627\u0639 \u0633\u0647\u0644.",

  "products.title": "\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A",
  "products.search": "\u0627\u0628\u062D\u062B \u0639\u0646 \u0645\u0646\u062A\u062C\u0627\u062A...",
  "products.noResults": "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0645\u0646\u062A\u062C\u0627\u062A",
  "products.addToCart": "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629",
  "products.outOfStock": "\u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631",
  "products.inStock": "\u0645\u062A\u0648\u0641\u0631",
  "products.reviews": "\u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A",
  "products.description": "\u0627\u0644\u0648\u0635\u0641",

  "cart.title": "\u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642",
  "cart.empty": "\u0633\u0644\u062A\u0643 \u0641\u0627\u0631\u063A\u0629",
  "cart.subtotal": "\u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0641\u0631\u0639\u064A",
  "cart.checkout": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0634\u0631\u0627\u0621",
  "cart.remove": "\u0625\u0632\u0627\u0644\u0629",
  "cart.continueShopping": "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062A\u0633\u0648\u0642",

  "checkout.title": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0634\u0631\u0627\u0621",
  "checkout.shipping": "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0634\u062D\u0646",
  "checkout.fullName": "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
  "checkout.phone": "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641",
  "checkout.address": "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
  "checkout.city": "\u0627\u0644\u0645\u062F\u064A\u0646\u0629",
  "checkout.giftMessage": "\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u0647\u062F\u064A\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)",
  "checkout.giftMessagePlaceholder": "\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u0629 \u0635\u0627\u062F\u0642\u0629 \u0644\u0644\u0645\u0633\u062A\u0644\u0645...",
  "checkout.fontStyle": "\u0646\u0645\u0637 \u0627\u0644\u062E\u0637",
  "checkout.discount": "\u0631\u0645\u0632 \u0627\u0644\u062E\u0635\u0645",
  "checkout.apply": "\u062A\u0637\u0628\u064A\u0642",
  "checkout.remove": "\u0625\u0632\u0627\u0644\u0629",
  "checkout.orderSummary": "\u0645\u0644\u062E\u0635 \u0627\u0644\u0637\u0644\u0628",
  "checkout.total": "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A",
  "checkout.shipping_free": "\u0645\u062C\u0627\u0646\u064A",
  "checkout.placeOrder": "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062F\u0641\u0639",
  "checkout.payment": "\u0627\u0644\u062F\u0641\u0639",
  "checkout.giftWrapping": "\u062A\u063A\u0644\u064A\u0641 \u0627\u0644\u0647\u062F\u064A\u0629",
  "checkout.selectWrapping": "\u0627\u062E\u062A\u0631 \u0646\u0645\u0637 \u0627\u0644\u062A\u063A\u0644\u064A\u0641",
  "checkout.packaging": "\u062A\u063A\u0644\u064A\u0641 \u0627\u0644\u0647\u062F\u064A\u0629",
  "checkout.selectPackaging": "\u0627\u062E\u062A\u0631 \u0627\u0644\u062A\u063A\u0644\u064A\u0641",
  "checkout.charity": "\u062A\u0628\u0631\u0639 \u0644\u0644\u062E\u064A\u0631",
  "checkout.selectCharity": "\u0627\u062E\u062A\u0631 \u0645\u0624\u0633\u0633\u0629 \u062E\u064A\u0631\u064A\u0629",
  "checkout.donatePercent": "\u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u0628\u0631\u0639",
  "checkout.scheduledDelivery": "\u062C\u062F\u0648\u0644\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644",
  "checkout.selectDate": "\u0627\u062E\u062A\u0631 \u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0648\u0635\u064A\u0644",
  "checkout.multiDestination": "\u0648\u062C\u0647\u0627\u062A \u0645\u062A\u0639\u062F\u062F\u0629",
  "checkout.addRecipient": "\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u0644\u0645",

  "orders.title": "\u0637\u0644\u0628\u0627\u062A\u064A",
  "orders.noOrders": "\u0644\u0645 \u062A\u0642\u0645 \u0628\u0623\u064A \u0637\u0644\u0628 \u0628\u0639\u062F",
  "orders.trackOrder": "\u062A\u062A\u0628\u0639 \u0627\u0644\u0637\u0644\u0628",
  "orders.status": "\u0627\u0644\u062D\u0627\u0644\u0629",
  "orders.orderDate": "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628",

  "wishlist.title": "\u0642\u0627\u0626\u0645\u0629 \u0623\u0645\u0646\u064A\u0627\u062A\u064A",
  "wishlist.empty": "\u0642\u0627\u0626\u0645\u0629 \u0623\u0645\u0646\u064A\u0627\u062A\u0643 \u0641\u0627\u0631\u063A\u0629",
  "wishlist.addToCart": "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629",

  "reviews.title": "\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u0639\u0645\u0644\u0627\u0621",
  "reviews.writeReview": "\u0627\u0643\u062A\u0628 \u062A\u0642\u064A\u064A\u0645\u0627",
  "reviews.noReviews": "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0642\u064A\u064A\u0645\u0627\u062A. \u0643\u0646 \u0623\u0648\u0644 \u0645\u0646 \u064A\u0642\u064A\u0645!",
  "reviews.submit": "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645",

  "footer.rights": "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629",
  "footer.about": "\u0645\u0646 \u0646\u062D\u0646",
  "footer.privacy": "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629",
  "footer.terms": "\u0634\u0631\u0648\u0637 \u0627\u0644\u062E\u062F\u0645\u0629",

  "common.loading": "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...",
  "common.error": "\u062D\u062F\u062B \u062E\u0637\u0623",
  "common.save": "\u062D\u0641\u0638",
  "common.cancel": "\u0625\u0644\u063A\u0627\u0621",
  "common.delete": "\u062D\u0630\u0641",
  "common.edit": "\u062A\u0639\u062F\u064A\u0644",
  "common.create": "\u0625\u0646\u0634\u0627\u0621",
  "common.search": "\u0628\u062D\u062B",
  "common.filter": "\u062A\u0635\u0641\u064A\u0629",
  "common.all": "\u0627\u0644\u0643\u0644",
  "common.active": "\u0646\u0634\u0637",
  "common.inactive": "\u063A\u064A\u0631 \u0646\u0634\u0637",
  "common.yes": "\u0646\u0639\u0645",
  "common.no": "\u0644\u0627",
  "common.back": "\u0631\u062C\u0648\u0639",
  "common.next": "\u0627\u0644\u062A\u0627\u0644\u064A",
  "common.previous": "\u0627\u0644\u0633\u0627\u0628\u0642",
  "common.viewDetails": "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644",

  "bundles.title": "\u062D\u0632\u0645 \u0627\u0644\u0647\u062F\u0627\u064A\u0627",
  "bundles.occasion": "\u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629",
  "bundles.createCustom": "\u0625\u0646\u0634\u0627\u0621 \u062D\u0632\u0645\u0629 \u0645\u062E\u0635\u0635\u0629",
  "bundles.items": "\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u062D\u0632\u0645\u0629",
  "bundles.totalValue": "\u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A\u0629",
  "bundles.bundlePrice": "\u0633\u0639\u0631 \u0627\u0644\u062D\u0632\u0645\u0629",
  "bundles.youSave": "\u062A\u0648\u0641\u0631",

  "registry.title": "\u0633\u062C\u0644 \u0627\u0644\u0647\u062F\u0627\u064A\u0627",
  "registry.create": "\u0625\u0646\u0634\u0627\u0621 \u0633\u062C\u0644",
  "registry.eventName": "\u0627\u0633\u0645 \u0627\u0644\u062D\u062F\u062B",
  "registry.eventDate": "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062D\u062F\u062B",
  "registry.eventType": "\u0646\u0648\u0639 \u0627\u0644\u062D\u062F\u062B",
  "registry.shareLink": "\u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629",
  "registry.addItems": "\u0625\u0636\u0627\u0641\u0629 \u0639\u0646\u0627\u0635\u0631",
  "registry.purchased": "\u062A\u0645 \u0627\u0644\u0634\u0631\u0627\u0621",
  "registry.remaining": "\u0645\u062A\u0628\u0642\u064A",

  "groupGift.title": "\u0647\u062F\u064A\u0629 \u062C\u0645\u0627\u0639\u064A\u0629",
  "groupGift.create": "\u0628\u062F\u0621 \u0647\u062F\u064A\u0629 \u062C\u0645\u0627\u0639\u064A\u0629",
  "groupGift.contribute": "\u0645\u0633\u0627\u0647\u0645\u0629",
  "groupGift.funded": "\u062A\u0645 \u0627\u0644\u062A\u0645\u0648\u064A\u0644!",
  "groupGift.progress": "\u0627\u0644\u062A\u0642\u062F\u0645",
  "groupGift.shareLink": "\u0634\u0627\u0631\u0643 \u0645\u0639 \u0627\u0644\u0623\u0635\u062F\u0642\u0627\u0621",
  "groupGift.contributors": "\u0627\u0644\u0645\u0633\u0627\u0647\u0645\u0648\u0646",

  "social.title": "\u062A\u0633\u0648\u0642 \u0645\u0639\u0627",
  "social.createSession": "\u0625\u0646\u0634\u0627\u0621 \u062C\u0644\u0633\u0629 \u062A\u0633\u0648\u0642",
  "social.joinSession": "\u0627\u0646\u0636\u0645\u0627\u0645 \u0644\u0644\u062C\u0644\u0633\u0629",
  "social.enterCode": "\u0623\u062F\u062E\u0644 \u0631\u0645\u0632 \u0627\u0644\u062C\u0644\u0633\u0629",
  "social.participants": "\u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0648\u0646",
  "social.shareProduct": "\u0645\u0634\u0627\u0631\u0643\u0629 \u0645\u0646\u062A\u062C",
  "social.sendMessage": "\u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629",

  "charity.title": "\u0634\u0631\u0643\u0627\u0621 \u0627\u0644\u062E\u064A\u0631",
  "charity.donateWith": "\u062A\u0628\u0631\u0639 \u0645\u0639 \u0645\u0634\u062A\u0631\u064A\u0627\u062A\u0643",
  "charity.totalDonated": "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062A\u0628\u0631\u0639\u0627\u062A",
};

const fr: TranslationKeys = {
  "nav.home": "Accueil",
  "nav.products": "Produits",
  "nav.cart": "Panier",
  "nav.wishlist": "Favoris",
  "nav.orders": "Mes Commandes",
  "nav.profile": "Profil",
  "nav.admin": "Admin",
  "nav.faq": "FAQ",
  "nav.contact": "Contact",
  "nav.signIn": "Connexion",
  "nav.signUp": "Inscription",
  "nav.bundles": "Packs",
  "nav.registry": "Registre",
  "nav.groupGift": "Cadeau de Groupe",
  "nav.shopTogether": "Acheter Ensemble",
  "nav.more": "Plus",

  "home.hero.title": "Bienvenue \u00E0 Gift Gallery",
  "home.hero.subtitle": "D\u00E9couvrez les cadeaux parfaits pour chaque occasion. Des bijoux aux montres, des parfums aux accessoires.",
  "home.hero.shopNow": "Acheter Maintenant",
  "home.hero.browse": "Parcourir les Cat\u00E9gories",
  "home.categories.title": "Acheter par Cat\u00E9gorie",
  "home.categories.subtitle": "Trouvez le cadeau parfait dans nos collections",
  "home.featured.title": "Produits Vedettes",
  "home.featured.subtitle": "Nos cadeaux les plus populaires",
  "home.featured.viewAll": "Voir Tous les Produits",
  "home.why.title": "Pourquoi Choisir Gift Gallery",
  "home.why.curated": "Cadeaux S\u00E9lectionn\u00E9s",
  "home.why.curatedDesc": "Produits s\u00E9lectionn\u00E9s pour chaque occasion et budget.",
  "home.why.delivery": "Livraison Rapide",
  "home.why.deliveryDesc": "Livraison rapide et fiable \u00E0 votre porte.",
  "home.why.secure": "Achat S\u00E9curis\u00E9",
  "home.why.secureDesc": "Paiement s\u00E9curis\u00E9 et retours faciles.",

  "products.title": "Tous les Produits",
  "products.search": "Rechercher des produits...",
  "products.noResults": "Aucun produit trouv\u00E9",
  "products.addToCart": "Ajouter au Panier",
  "products.outOfStock": "Rupture de Stock",
  "products.inStock": "En Stock",
  "products.reviews": "Avis",
  "products.description": "Description",

  "cart.title": "Panier",
  "cart.empty": "Votre panier est vide",
  "cart.subtotal": "Sous-total",
  "cart.checkout": "Passer la Commande",
  "cart.remove": "Supprimer",
  "cart.continueShopping": "Continuer les Achats",

  "checkout.title": "Commande",
  "checkout.shipping": "D\u00E9tails de Livraison",
  "checkout.fullName": "Nom Complet",
  "checkout.phone": "T\u00E9l\u00E9phone",
  "checkout.address": "Adresse",
  "checkout.city": "Ville",
  "checkout.giftMessage": "Message Cadeau (Optionnel)",
  "checkout.giftMessagePlaceholder": "\u00C9crivez un message sinc\u00E8re pour le destinataire...",
  "checkout.fontStyle": "Style de Police",
  "checkout.discount": "Code de R\u00E9duction",
  "checkout.apply": "Appliquer",
  "checkout.remove": "Supprimer",
  "checkout.orderSummary": "R\u00E9sum\u00E9 de la Commande",
  "checkout.total": "Total",
  "checkout.shipping_free": "Gratuit",
  "checkout.placeOrder": "Continuer au Paiement",
  "checkout.payment": "Paiement",
  "checkout.giftWrapping": "Emballage Cadeau",
  "checkout.selectWrapping": "S\u00E9lectionnez un style d'emballage",
  "checkout.packaging": "Emballage",
  "checkout.selectPackaging": "S\u00E9lectionnez l'emballage",
  "checkout.charity": "Don Caritatif",
  "checkout.selectCharity": "S\u00E9lectionnez une association",
  "checkout.donatePercent": "Pourcentage de don",
  "checkout.scheduledDelivery": "Livraison Programm\u00E9e",
  "checkout.selectDate": "S\u00E9lectionnez la date de livraison",
  "checkout.multiDestination": "Destinations Multiples",
  "checkout.addRecipient": "Ajouter un Destinataire",

  "orders.title": "Mes Commandes",
  "orders.noOrders": "Vous n'avez pas encore pass\u00E9 de commande",
  "orders.trackOrder": "Suivre la Commande",
  "orders.status": "Statut",
  "orders.orderDate": "Date de Commande",

  "wishlist.title": "Ma Liste de Souhaits",
  "wishlist.empty": "Votre liste de souhaits est vide",
  "wishlist.addToCart": "Ajouter au Panier",

  "reviews.title": "Avis Clients",
  "reviews.writeReview": "\u00C9crire un Avis",
  "reviews.noReviews": "Pas encore d'avis. Soyez le premier!",
  "reviews.submit": "Soumettre l'Avis",

  "footer.rights": "Tous droits r\u00E9serv\u00E9s",
  "footer.about": "\u00C0 Propos",
  "footer.privacy": "Politique de Confidentialit\u00E9",
  "footer.terms": "Conditions d'Utilisation",

  "common.loading": "Chargement...",
  "common.error": "Une erreur est survenue",
  "common.save": "Enregistrer",
  "common.cancel": "Annuler",
  "common.delete": "Supprimer",
  "common.edit": "Modifier",
  "common.create": "Cr\u00E9er",
  "common.search": "Rechercher",
  "common.filter": "Filtrer",
  "common.all": "Tous",
  "common.active": "Actif",
  "common.inactive": "Inactif",
  "common.yes": "Oui",
  "common.no": "Non",
  "common.back": "Retour",
  "common.next": "Suivant",
  "common.previous": "Pr\u00E9c\u00E9dent",
  "common.viewDetails": "Voir les D\u00E9tails",

  "bundles.title": "Packs Cadeaux",
  "bundles.occasion": "Occasion",
  "bundles.createCustom": "Cr\u00E9er un Pack Personnalis\u00E9",
  "bundles.items": "Articles du Pack",
  "bundles.totalValue": "Valeur Totale",
  "bundles.bundlePrice": "Prix du Pack",
  "bundles.youSave": "Vous \u00C9conomisez",

  "registry.title": "Registre de Cadeaux",
  "registry.create": "Cr\u00E9er un Registre",
  "registry.eventName": "Nom de l'\u00C9v\u00E9nement",
  "registry.eventDate": "Date de l'\u00C9v\u00E9nement",
  "registry.eventType": "Type d'\u00C9v\u00E9nement",
  "registry.shareLink": "Lien de Partage",
  "registry.addItems": "Ajouter des Articles",
  "registry.purchased": "Achet\u00E9",
  "registry.remaining": "Restant",

  "groupGift.title": "Cadeau de Groupe",
  "groupGift.create": "D\u00E9marrer un Cadeau de Groupe",
  "groupGift.contribute": "Contribuer",
  "groupGift.funded": "Enti\u00E8rement Financ\u00E9!",
  "groupGift.progress": "Progression",
  "groupGift.shareLink": "Partager avec des Amis",
  "groupGift.contributors": "Contributeurs",

  "social.title": "Acheter Ensemble",
  "social.createSession": "Cr\u00E9er une Session d'Achat",
  "social.joinSession": "Rejoindre la Session",
  "social.enterCode": "Entrez le code de session",
  "social.participants": "Participants",
  "social.shareProduct": "Partager le Produit",
  "social.sendMessage": "Envoyer un Message",

  "charity.title": "Partenaires Caritatifs",
  "charity.donateWith": "Faites un don avec votre achat",
  "charity.totalDonated": "Total des Dons",
};

export const translations: Record<Locale, TranslationKeys> = { en, ur, ar, fr };
