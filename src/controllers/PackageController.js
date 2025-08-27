import Package from '../models/PackageModel.js';
import PackagePricing from '../models/PackagePricingModel.js';

class PackageController{
    getAllPackage = async (req, res) => {
        try {
            const package_list = await Package.find({});
            return res.status(200).json({
                success: true,
                count_record: package_list.length,
                package_list
            })
        }
        catch(err){
            return  res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }

    getPackagePricing = async (req, res) => {
        const {priority} = req.params;

        // join Package & PackagePricing: priority bên trong Package - ứng với 1 id, lọc tất cả các PackagePricing có trường package_id = id này, trả về client
        try{
            const package_entry = await Package.findOne({priority_level : Number(priority)});
            console.log(package_entry);

            const package_list = await PackagePricing.find({package_id: package_entry._id});
            console.log(package_list);

            return res.status(200).json({
                success: true,
                count_record: package_list.length,
                package_list
            })
        }
        catch(err){
            return  res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }

    getAllPackagePricing = async (req, res) => {
        try {  
            const package_list = await PackagePricing.find({});
            return res.status(200).json({
                success: true,
                count_record: package_list.length,
                package_list
            })

        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }


}

export default new PackageController();