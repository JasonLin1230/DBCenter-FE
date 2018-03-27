module.exports = async function(ctx, next) {
    const phone = ctx.session.phone

    if (phone) {
        await db(`USE user_${phone}`)
        console.log(`database user_${phone} used!`)
    } else {
        ctx.response.redirect('/login')
    }
    
} 