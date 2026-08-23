export default async function handler(req, res) {
    try {
        const token = process.env.BLYNK_AUTH_TOKEN;

        if (!token) {
            return res.status(500).json({
                error: "BLYNK_AUTH_TOKEN belum diatur"
            });
        }

        const url =
            `https://blynk.cloud/external/api/get?token=${token}&V0&V1&V2&V3`;

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Gagal mengambil data dari Blynk"
            });
        }

        const data = await response.json();

        return res.status(200).json({
            jarak: Number(data.V0),
            tinggiAir: Number(data.V1),
            status: data.V2,
            alarm: Number(data.V3),
            waktu: new Date().toISOString()
        });

    } catch (error) {

        return res.status(500).json({
            error: "Server error",
            detail: error.message
        });
    }
}
