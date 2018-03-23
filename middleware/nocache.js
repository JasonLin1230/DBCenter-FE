module.exports = async (ctx, next) => {
    ctx.set('Cache-Control', 'no-cache')
    ctx.set('Pragma', 'no-cache')
    ctx.set('Expires', '-1')
    ctx.set('Cache-Control', 'No-store')

    await next()
}