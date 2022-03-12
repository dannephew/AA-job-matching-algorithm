import Business from '../models/business.js'
function showBusiness(req, res){
    Business.findById(req.params.id)

}