const db = require('../util/db');

exports.bookmarkList = async(req, res) =>{
    try{
        console.log("req.body");
        console.log(req.body);
        const user_id = req.body.user_id;
        let page = req.query.page;

        page = (!page) ? 0 : page-1;

        let result = [];
        let query = " SELECT bookmark.bookmark_id, item.item_name, item.item_price, item.item_tn_image_path FROM item JOIN bookmark ON item.item_id = bookmark.item_id WHERE bookmark.user_id = ? ORDER BY bookmark.bookmark_id LIMIT 10 OFFSET ?"; // 10개만 가져온다 시작점에서(어디가 시작인지 몰라서 ?)
   
        let responseBody ={};

        result = await db(query, [user_id, page * 10] );

        responseBody = {
            status: 200,
            bookmarkList: result
        };
        res.json(responseBody);
    }catch(err) {
        console.error(err);
        responseBody = {
            status : 400,
            mesage: "잘못된 페이지 요청입니다"
        }
        res.json(responseBody);
    
    }
}
exports.mypageNation = async (req, res) => {
    try {
      // 데이터 준비
      // const itemType = req.query.itemType;
      const itemType = req.params.itemDetailType;
      let keyword = req.query.keyword;
      const page = parseInt(req.query.page) || 1;
  
      // 키워드가 null이거나 비어 있으면 %%을 붙여 쿼리문이 잘 돌아가도록 함.
      keyword = !keyword ? "%%" : "%" + keyword + "%";
      let result = [];
      let maxPage = 1;
  
      // 페이지네이션
      const pageSize = 12;
      const offset = (page - 1) * pageSize;
      if (itemType == "all") {
        const countQuery = `
            SELECT COUNT(*) AS totalCount 
            FROM item 
            WHERE item_name LIKE ?
          `;
        const countResult = await db(countQuery, [keyword]);
        const totalCount = countResult[0].totalCount;
        maxPage = Math.ceil(totalCount / pageSize);
  
        // 현재 페이지에 따른 item 데이터 가져오기
        const query = `
            SELECT item.item_id, item.item_name, item.item_discount_rate, item.item_tn_image_path
            FROM item 
            WHERE item.item_name LIKE ? 
            LIMIT ? OFFSET ?
          `;
        result = await db(query, [keyword, pageSize, offset]);
      } else {
        const countQuery = `
            SELECT COUNT(*) AS totalCount 
            FROM item 
            JOIN item_detail ON item.item_id = item_detail.item_id 
            WHERE item_detail.item_detail_type = ? AND item_name LIKE ?
          `;
        const countResult = await db(countQuery, [itemType, keyword]);
        const totalCount = countResult[0].totalCount;
        maxPage = Math.ceil(totalCount / pageSize);
  
        // 현재 페이지에 따른 item 데이터 가져오기
        const query = `
            SELECT DISTINCT item.item_id, item.item_name, item.item_discount_rate, item.item_tn_image_path 
            FROM item 
            JOIN item_detail ON item.item_id = item_detail.item_id 
            WHERE item_detail.item_detail_type = ? AND item.item_name LIKE ? 
            LIMIT ? OFFSET ?
          `;
        result = await db(query, [itemType, keyword, pageSize, offset]);
      }
  
      // 데이터 보낼 준비
      const responseBody = {
        status: 200,
        message: "ProductController.js의 productList 데이터 성공",
        data: result,
        maxPage: maxPage,
      };
      // 데이터 보내기
      res.json(responseBody);
    } catch (err) {
      console.error(err);
      const responseBody = {
        status: 400,
        message: err.message,
      };
      res.json(responseBody);
    }
  };