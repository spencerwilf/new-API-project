const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, SpotImage, Review, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const moment = require('moment')


router.delete('/:imageId', requireAuth, async (req, res) => {
    let currentUserId = req.user.id;

    let spotImage = await SpotImage.findByPk(req.params.imageId);

    if (!spotImage) {
        return res.status(404).json({
            "message": "Spot Image could not be found",
            "statusCode": 404
          })
    }

    let spot = await spotImage.getSpot({
        where: {
            ownerId: currentUserId
        }
    })

    if (!spot || spot.id !== spotImage.spotId) {
        return res.status(403).json({
            message: 'Forbidden',
            statusCode: 403
        })
    }

    await spotImage.destroy();

    res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
})




module.exports = router;
