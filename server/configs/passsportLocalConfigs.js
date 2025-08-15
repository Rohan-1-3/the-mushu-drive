import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client"; // Add this

const prisma = new PrismaClient(); // Add this

passport.use(
    new LocalStrategy(async (username, password, done)=>{
        try{
            // Replace pool.query with Prisma
            const user = await prisma.user.findUnique({
                where: { username: username }
            });
            
            if(!user){
                return done(null, false, {msg: "Incorrect Username"});
            }

            const match = await compare(password, user.password)
            if(!match){
                return done(null, false, { msg: "Incorrect Password"});
            }

            return done(null, user);
        }catch(err){
            return done(err);
        }
    })
)

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser(async (id, done)=>{
    try{
        // Replace pool.query with Prisma
        const user = await prisma.user.findUnique({
            where: { id: id }
        });
        done(null, user);
    }catch(err){
        done(err);
    }
});

export default passport;