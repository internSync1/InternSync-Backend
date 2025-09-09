import express from 'express'
import user from '../routes/userRoute'
import jobRoute from "../routes/jobRoute";
import interestsRoute from "../routes/interestsRoute";
import questionsRoute from "../routes/questionsRoute";
import applicationRoute from "../routes/applicationRoute";
import bookmarkRoute from "../routes/bookmarkRoute";
import fileRoute from '../routes/fileRoute';
import dashboardRoute from "../routes/dashboardRoute";
import otpRoute from "../routes/otpRoute";
import adminRoute from "../routes/adminRoute";
import swipeRoute from "../routes/swipeRoute";
import notificationsRoute from "../routes/notificationsRoute";
import contentRoute from "../routes/contentRoute";



const router = express.Router()

router.use('/v1/user', user)
router.use("/v1/job", jobRoute)
router.use("/v1/interests", interestsRoute)
router.use("/v1/questions", questionsRoute)
router.use('/v1/application', applicationRoute)
router.use('/v1/bookmark', bookmarkRoute)
router.use('/v1/file', fileRoute);
router.use("/v1/dashboard", dashboardRoute);
router.use('/v1/auth', otpRoute);
router.use('/v1/admin', adminRoute);
router.use('/v1/swipe', swipeRoute);
router.use('/v1/notifications', notificationsRoute);
router.use('/v1/content', contentRoute);

export default router