export async function GET() {

    try {

        const token = process.env.BLYNK_AUTH_TOKEN;

        // Cek apakah token tersedia
        if (!token) {
            return Response.json(
                {
                    berhasil: false,
                    error: "BLYNK_AUTH_TOKEN belum diatur di Vercel"
                },
                { status: 500 }
            );
        }

        // Ambil data dari Blynk
        const url =
            `https://blynk.cloud/external/api/get?token=${encodeURIComponent(token)}&V0&V1&V2&V3`;

        const response = await fetch(url);

        // Jika Blynk mengembalikan error
        if (!response.ok) {

            const errorText = await response.text();

            return Response.json(
                {
                    berhasil: false,
                    error: "Gagal mengambil data dari Blynk",
                    status: response.status,
                    detail: errorText
                },
                { status: 502 }
            );
        }

        const data = await response.json();

        // Kirim data ke website
        return Response.json({
            berhasil: true,

            jarak: Number(data.V0),
            tinggiAir: Number(data.V1),
            status: data.V2,
            alarm: Number(data.V3),

            waktu: new Date().toISOString()
        });

    } catch (error) {

        return Response.json(
            {
                berhasil: false,
                error: "Terjadi kesalahan pada server",
                detail: error.message
            },
            { status: 500 }
        );
    }
}
