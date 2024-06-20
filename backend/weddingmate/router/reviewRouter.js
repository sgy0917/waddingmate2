const express = require('express');
const {adminReviewList, adminReviewDelete} = require('../controller/adminReviewController');

const router = express.Router();

// 컨트롤러의 여러 함수들을 Request URI에 맞게 매핑하는 역할 수행
router.get('/adminlist', adminReviewList);
router.post('/admindelete', adminReviewDelete);

module.exports = router;