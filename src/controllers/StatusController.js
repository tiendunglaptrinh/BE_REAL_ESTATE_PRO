import Status from "../models/StatusModel.js";

class StatusController {
    // Controller
    getPublishedStatus = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            const skip = (page - 1) * limit;
            const [statuses, total] = await Promise.all([
                Status.find({ status: "published" })
                    .populate("user_id", "fullname email avatar")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Status.countDocuments({ status: "published" }),
            ]);

            return res.status(200).json({
                success: true,
                data: statuses,
                total,
                hasMore: page * limit < total,
            });
        } catch (err) {
            console.error("Lỗi getPublishedStatus:", err);
            return res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy danh sách status",
            });
        }
    };

    // User tạo status mới
    createStatusByUser = async (req, res) => {
        try {
            const { image, province, content, linked_post, mean } = req.body;
            const { userId } = req.user;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Thiếu thông tin bắt buộc (content, province)",
                });
            }

            const newStatus = new Status({
                user_id: userId,
                image: image || "",
                province,
                content,
                linked_post: linked_post || "",
                mean: mean || "shared",
                status: "pending", // sau này có thể đổi sang "pending"
            });

            await newStatus.save();

            return res.status(201).json({
                success: true,
                message: "Tạo status thành công, chờ admin duyệt",
                data: newStatus,
            });
        } catch (err) {
            console.error("Lỗi createStatusByUser:", err);
            return res.status(500).json({
                success: false,
                message: "Lỗi server khi tạo status",
            });
        }
    };

    getStatusPending = async (req, res) => {
        try{
            const { userId } = req.user;

            const listStatus = await Status.find({ user_id: userId, status: "pending" })
            .populate("user_id", "fullname email avatar")
            .sort({ createdAt: -1 });

            if (!listStatus) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy status nào",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Lấy danh sách status thành công",
                data: listStatus,
                num_status: listStatus.length
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy danh sách status",
            });
        }
    }
    
    updataStatusByUser = async (req, res) => {}

    deleteStatusByUser = async (req, res) => {}
}

export default new StatusController();