
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { Link, useNavigate } from 'react-router'

const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceLowest: '#ffffff',
    surfaceHigh: '#eae8e5',
    surfaceHighest: '#e4e2df',
    onSurface: '#1b1c1a',
    secondary: '#7A6E63',
    muted: '#B5ADA3',
    primary: '#C9A96E',
    outlineVariant: '#d0c5b5',
}

const Cart = () => {
    const cartItems = useSelector(state => state.cart.items)
    const {
    handleGetCart,
    handleIncrementCartItems,
    handleDecrementCartItems
} = useCart();
    const navigate = useNavigate()

    const [quantities, setQuantities] = useState({})

    useEffect(() => {
        handleGetCart()
    }, [])

    useEffect(() => {
        if (cartItems?.length) {
            const initial = {}
            cartItems.forEach(item => {
                initial[item._id] = item.quantity ?? 1
            })
            setQuantities(initial)
        }
    }, [cartItems])

    const changeQty = async (id, productId, variantId, delta) => {
    if (delta === 1) {
        await handleIncrementCartItems({
            productId,
            variantId
        });
    }

    if (delta === -1) {   
        await handleDecrementCartItems({
            productId,
            variantId
        });
    }

    await handleGetCart();
};

    const subtotal = cartItems?.reduce((sum, item) => {
        const qty = quantities[item._id] ?? item.quantity ?? 1
        return sum + (item.price?.amount ?? 0) * qty
    }, 0) ?? 0

    const shippingFree = subtotal >= 15000
    const totalPieces = cartItems?.length ?? 0

//    const getVariantDetails = (product, variantId) => {
//     console.log("product", product);
//     console.log("variants", product?.variants);

//     if (!product?.variants || !variantId) return null;

//     return product.variants.find(
//         v => v._id?.toString() === variantId?.toString()
//     ) ?? null;
// };

     const getVariantDetails = (product) => {
    return product?.variants || null;
}

    const getDisplayImage = (product, variant) => {
        if (variant?.images?.length) return variant.images[0].url
        if (product?.images?.length) return product.images[0].url
        return null
    }

    const formatCurrency = (amount, currency = 'INR') =>
        `${currency} ${Number(amount).toLocaleString('en-IN')}`

    console.log(cartItems)

    // ── Empty State ──
    if (!cartItems?.length) {
        return (
            <>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
                <div
                    className="min-h-screen flex flex-col"
                    style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}
                >
                    <nav
                        className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${tokens.surfaceHighest}` }}
                    >
                        <Link
                            to="/"
                            className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.primary }}
                        >
                            Snitch.
                        </Link>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-[10px] uppercase tracking-[0.22em] font-medium hover:opacity-70 transition-opacity"
                            style={{ color: tokens.secondary }}
                        >
                            Return to Archive
                        </button>
                    </nav>

                    <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-24 px-8">
                        <p
                            className="text-5xl md:text-6xl font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
                        >
                            Your selection is empty.
                        </p>
                        <p
                            className="text-[10px] uppercase tracking-[0.22em]"
                            style={{ color: tokens.muted }}
                        >
                            Curate your collection
                        </p>
                        <Link
                            to="/"
                            className="mt-4 px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                            style={{ backgroundColor: tokens.onSurface, color: tokens.surface }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = tokens.primary
                                e.currentTarget.style.color = tokens.onSurface
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = tokens.onSurface
                                e.currentTarget.style.color = tokens.surface
                            }}
                        >
                            Explore the Archive
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen pb-24"
                style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                        {/* ── Left: Cart Items ── */}
                        <div className="w-full lg:w-[65%]">

                            <div className="mb-10">
                                <h1
                                    className="font-light leading-[1.05] mb-2"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        color: tokens.onSurface,
                                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                    }}
                                >
                                    Your Selection
                                </h1>
                                <p
                                    className="text-[10px] uppercase tracking-[0.24em] font-medium"
                                    style={{ color: tokens.muted }}
                                >
                                    {totalPieces} {totalPieces === 1 ? 'piece' : 'pieces'}
                                </p>
                            </div>

                            <div className="flex flex-col gap-6">
                                {cartItems.map(item => {
                                    const { product, variant: variantId, price } = item;
                                    const _id = product?._id;
                                    // const variantDetail = getVariantDetails(product, variantId)
                                    const variantDetail = getVariantDetails(product);
                                    const imageUrl = getDisplayImage(product, variantDetail)
                                    const displayPrice = price ?? variantDetail?.price ?? product?.price
                                    const qty = quantities[_id] ?? item.quantity ?? 1
                                    const attributes = variantDetail?.attribute ?? variantDetail?.attributes ?? {}
                                    const stock = variantDetail?.stock
                                    const variantPrice = variantDetail?.price

                                    return (
                                        <div
                                            key={_id}
                                            className="flex gap-6 md:gap-8 p-6 md:p-8 transition-all duration-300"
                                            style={{ backgroundColor: tokens.surfaceLow }}
                                        >
                                            {/* Image */}
                                            <div
                                                className="flex-shrink-0 overflow-hidden"
                                                style={{
                                                    width: 'clamp(100px, 15vw, 160px)',
                                                    aspectRatio: '4/5',
                                                    backgroundColor: tokens.surfaceHighest,
                                                }}
                                            >
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product?.title}
                                                        className="w-full h-full object-cover"
                                                        onError={e => { e.currentTarget.style.display = 'none' }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full" style={{ backgroundColor: tokens.surfaceHigh }} />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h2
                                                        className="font-light leading-tight mb-3"
                                                        style={{
                                                            fontFamily: "'Cormorant Garamond', serif",
                                                            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                                                            color: tokens.onSurface,
                                                        }}
                                                    >
                                                        {product?.title}
                                                    </h2>

                                                    {Object.keys(attributes).length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {Object.entries(attributes).map(([key, val]) => (
                                                                <span
                                                                    key={key}
                                                                    className="px-3 py-1 text-[9px] uppercase tracking-[0.18em] font-medium"
                                                                    style={{ backgroundColor: tokens.primary, color: '#fff' }}
                                                                >
                                                                    {val}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <p
                                                        className="text-[11px] uppercase tracking-[0.2em] font-medium mb-1"
                                                        style={{ color: tokens.onSurface }}
                                                    >
                                                        {displayPrice
                                                            ? formatCurrency(displayPrice.amount, displayPrice.currency)
                                                            : '—'}
                                                    </p>

                                                    {stock !== undefined && (
                                                        <p
                                                            className="text-[10px] uppercase tracking-[0.15em] mb-4"
                                                            style={{ color: tokens.muted }}
                                                        >
                                                            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                                                        </p>
                                                    )}
                                                        {
    displayPrice &&
    variantPrice &&
    displayPrice.amount !== variantPrice.amount && (
                                                            <>
                                                                {displayPrice.amount > variantPrice.amount
                                                                    ? <p className="text-[10px] uppercase tracking-[0.15em] mb-4 text-green-800 font-bold" > you will get this at {formatCurrency(variantPrice.amount, variantPrice.currency)} save {Math.abs(variantPrice.amount - displayPrice.amount)}.  </p>
                                                                    : <p className="text-[10px] uppercase tracking-[0.15em] mb-4 text-red-600 font-bold" > Warning this product will cost you {Math.abs(variantPrice.amount - displayPrice.amount)} more.  </p>
                                                                }
                                                            </>
                                                        )
                                                    }
                                                </div>

                                                {/* Qty + Remove */}
                                                <div className="flex items-center justify-between flex-wrap gap-4">
                                                    <div
                                                        className="flex items-center"
                                                        style={{ border: `1px solid ${tokens.outlineVariant}` }}
                                                    >
                                                        <button
                                                            onClick={() => changeQty(_id, product._id, variantId, -1)}
                                                            disabled={qty <= 1}
                                                            className="w-9 h-9 flex items-center justify-center text-sm font-light transition-opacity hover:opacity-60 disabled:opacity-30"
                                                            style={{ color: tokens.onSurface, borderRight: `1px solid ${tokens.outlineVariant}` }}
                                                            aria-label="Decrease quantity"
                                                        >
                                                            −
                                                        </button>
                                                        <span
                                                            className="w-10 text-center text-[11px] tracking-[0.12em] font-medium select-none"
                                                            style={{ color: tokens.onSurface }}
                                                        >
                                                            {qty}
                                                        </span>
                                                        <button
                                                            onClick={() => changeQty(_id, product._id, variantId, 1)}
                                                            className="w-9 h-9 flex items-center justify-center text-sm font-light transition-opacity hover:opacity-60"
                                                            style={{ color: tokens.onSurface, borderLeft: `1px solid ${tokens.outlineVariant}` }}
                                                            aria-label="Increase quantity"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemoveFromCart?.(_id)}
                                                        className="text-[10px] uppercase tracking-[0.22em] font-medium transition-all duration-200 hover:underline hover:opacity-70"
                                                        style={{ color: tokens.muted }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Policy strip */}
                            <div
                                className="mt-10 pt-8 grid grid-cols-3 gap-4 text-[10px] uppercase tracking-[0.12em]"
                                style={{ borderTop: `1px solid ${tokens.surfaceHighest}`, color: tokens.muted }}
                            >
                                <div>
                                    <p className="font-medium mb-1" style={{ color: tokens.secondary }}>Shipping</p>
                                    <p>Complimentary over INR 15,000</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1" style={{ color: tokens.secondary }}>Returns</p>
                                    <p>Within 14 days of delivery</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1" style={{ color: tokens.secondary }}>Authenticity</p>
                                    <p>100% Guaranteed</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Order Summary ── */}
                        <div className="w-full lg:w-[35%] lg:sticky lg:top-28">
                            <div
                                className="p-8"
                                style={{ backgroundColor: tokens.surfaceLowest, boxShadow: '0 20px 40px rgba(27,28,26,0.04)' }}
                            >
                                <h2
                                    className="font-light mb-6"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '1.75rem',
                                        color: tokens.onSurface,
                                    }}
                                >
                                    The Total
                                </h2>

                                <div className="mb-6" style={{ height: 1, backgroundColor: tokens.surfaceHighest }} />

                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: tokens.secondary }}>Subtotal</span>
                                        <span className="text-[11px] uppercase tracking-[0.12em] font-medium" style={{ color: tokens.onSurface }}>
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: tokens.secondary }}>Shipping</span>
                                        <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: shippingFree ? '#5a7a5a' : tokens.muted }}>
                                            {shippingFree ? 'Complimentary' : 'Complimentary over INR 15,000'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: tokens.secondary }}>Duties & Taxes</span>
                                        <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: tokens.muted }}>Included</span>
                                    </div>
                                </div>

                                <div className="mb-6" style={{ height: 1, backgroundColor: tokens.surfaceHighest }} />

                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: tokens.onSurface }}>Total</span>
                                    <span className="text-base uppercase tracking-[0.18em] font-medium" style={{ color: tokens.onSurface }}>
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>

                                <button
                                    className="w-full py-4 mb-3 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{ backgroundColor: tokens.onSurface, color: tokens.surface }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = tokens.primary
                                        e.currentTarget.style.color = tokens.onSurface
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = tokens.onSurface
                                        e.currentTarget.style.color = tokens.surface
                                    }}
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{ backgroundColor: 'transparent', border: `1px solid ${tokens.outlineVariant}`, color: tokens.onSurface }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = tokens.primary }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.outlineVariant }}
                                    onClick={() => navigate('/')}
                                >
                                    Continue Shopping
                                </button>

                                <p
                                    className="mt-6 text-center text-[9px] uppercase tracking-[0.14em] leading-relaxed"
                                    style={{ color: tokens.muted }}
                                >
                                    Free returns within 14 days · Authenticity guaranteed
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart
