import express from 'express'
import user from '../routes/userRoute'
import jobRoute from "../routes/jobRoute";
import interestsRoute from "../routes/interestsRoute";
import questionsRoute from "../routes/questionsRoute";
import applicationRoute from "../routes/applicationRoute";
import bookmarkRoute from "../routes/bookmarkRoute";
import fileRoute from '../routes/fileRoute';



const router = express.Router()

router.use('/v1/user', user)
router.use("/v1/job", jobRoute)
router.use("/v1/interests", interestsRoute)
router.use("/v1/questions", questionsRoute)
router.use('/v1/application', applicationRoute)
router.use('/v1/bookmark', bookmarkRoute)
router.use('/v1/file', fileRoute)

export default router