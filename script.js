// ==========================================
// DATA SENSOR DARI VERCEL / BLYNK
// ==========================================

let jarak = 0;
let tinggiAir = 0;
let statusAir = "MENUNGGU";
let alarm = 0;


// ==========================================
// ELEMENT HTML
// ==========================================

const jarakElement =
    document.getElementById("jarak");

const tinggiAirElement =
    document.getElementById("tinggiAir");

const statusElement =
    document.getElementById("statusAir");

const statusDescription =
    document.getElementById("statusDescription");

const statusIcon =
    document.getElementById("statusIcon");

const statusCard =
    document.getElementById("statusCard");

const alarmElement =
    document.getElementById("alarm");

const lastUpdate =
    document.getElementById("lastUpdate");


// ==========================================
// GRAFIK
// ==========================================

const ctx =
    document.getElementById("waterChart");

const waterChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{

            label: "Tinggi Air (cm)",

            data: [],

            borderWidth: 3,

            tension: 0.4,

            fill: true

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        scales: {

            y: {

                beginAtZero: true,

                max: 20

            }

        }

    }

});


// ==========================================
// UPDATE TAMPILAN DASHBOARD
// ==========================================

function updateDashboard() {

    jarakElement.textContent =
        jarak.toFixed(1);

    tinggiAirElement.textContent =
        tinggiAir.toFixed(1);

    statusElement.textContent =
        statusAir;


    // ==============================
    // NORMAL
    // ==============================

    if (statusAir === "NORMAL") {

        statusIcon.textContent = "🟢";

        statusDescription.textContent =
            "Kondisi air masih aman";

        statusCard.style.borderLeftColor =
            "#22c55e";

    }


    // ==============================
    // WASPADA
    // ==============================

    else if (statusAir === "WASPADA") {

        statusIcon.textContent = "🟡";

        statusDescription.textContent =
            "Ketinggian air mulai meningkat";

        statusCard.style.borderLeftColor =
            "#eab308";

    }


    // ==============================
    // BAHAYA
    // ==============================

    else if (statusAir === "BAHAYA") {

        statusIcon.textContent = "🔴";

        statusDescription.textContent =
            "PERINGATAN! Ketinggian air berbahaya";

        statusCard.style.borderLeftColor =
            "#ef4444";

    }


    // ==============================
    // ERROR
    // ==============================

    else {

        statusIcon.textContent = "⚠️";

        statusDescription.textContent =
            "Sensor tidak dapat membaca data";

        statusCard.style.borderLeftColor =
            "#64748b";

    }


    // ==============================
    // ALARM
    // ==============================

    if (alarm === 1) {

        alarmElement.textContent = "ON";

    } else {

        alarmElement.textContent = "OFF";

    }


    // ==============================
    // WAKTU UPDATE
    // ==============================

    lastUpdate.textContent =
        new Date().toLocaleTimeString("id-ID");

}


// ==========================================
// AMBIL DATA DARI VERCEL
// ==========================================

async function ambilDataSensor() {

    try {

        const response =
            await fetch("/api/sensor", {
                cache: "no-store"
            });


        // Cek HTTP response

        if (!response.ok) {

            throw new Error(
                "HTTP Error " + response.status
            );

        }


        // Ubah response menjadi JSON

        const data =
            await response.json();


        // ==================================
        // CEK DATA DARI BACKEND
        // ==================================

        if (!data.berhasil) {

            throw new Error(
                data.error || "Data sensor gagal"
            );

        }


        // ==================================
        // MASUKKAN DATA BLYNK
        // ==================================

        jarak =
            Number(data.jarak) || 0;

        tinggiAir =
            Number(data.tinggiAir) || 0;

        statusAir =
            data.status || "ERROR";

        alarm =
            Number(data.alarm) || 0;


        // ==================================
        // UPDATE DASHBOARD
        // ==================================

        updateDashboard();


        // ==================================
        // UPDATE GRAFIK
        // ==================================

        const waktu =
            new Date().toLocaleTimeString(
                "id-ID",
                {
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        waterChart.data.labels.push(waktu);

        waterChart.data.datasets[0].data.push(
            tinggiAir
        );


        // Maksimal 20 data

        if (
            waterChart.data.labels.length > 20
        ) {

            waterChart.data.labels.shift();

            waterChart.data.datasets[0].data.shift();

        }


        waterChart.update();


        console.log(
            "Data sensor:",
            data
        );


    } catch (error) {

        console.error(
            "Gagal mengambil data sensor:",
            error
        );


        // Tampilkan kondisi error

        statusAir = "ERROR";

        alarm = 0;

        statusIcon.textContent = "⚠️";

        statusElement.textContent = "ERROR";

        statusDescription.textContent =
            "Tidak dapat terhubung ke server sensor";

        statusCard.style.borderLeftColor =
            "#64748b";

        alarmElement.textContent =
            "OFF";

        lastUpdate.textContent =
            "Koneksi gagal";

    }

}


// ==========================================
// JALANKAN DASHBOARD
// ==========================================

// Ambil data pertama kali

ambilDataSensor();


// ==========================================
// UPDATE SETIAP 1 DETIK
// ==========================================

setInterval(
    ambilDataSensor,
    1000
);
