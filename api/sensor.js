export default function handler(req, res) {
    res.status(200).json({
        berhasil: true,
        pesan: "Backend Flood Monitoring aktif!"
    });
}
