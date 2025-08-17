export const requireAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    return res.status(401).json({
        message: "Authentication required"
    })
}

export const isOwner = (req, res, next)=>{
    if(requireAuth && req.user.id === req.file.userId){
        return next()
    }
    hasAccess(req, res, next)
}

export const hasAccess = (req, res, next)=>{
    if(requireAuth && (req.user.id === req.file.userId || req.user.role === 'admin' || !req.file.private)){
        return next()
    }
    return res.status(403).json({
        message: "Forbidden access"
    })
}