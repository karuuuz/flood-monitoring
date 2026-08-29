// ==========================================
// FLOODGUARD
// WEBSITE MONITORING BANJIR
// ==========================================

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

const connectionDot =
    document.getElementById("connectionDot");

const connectionText =
    document.getElementById("connectionText");

const statusBadge =
    document.getElementById("statusBadge");


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

            fill: true,

            pointRadius: 3

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        animation: false,

        scales: {

            y: {

                beginAtZero: true,

                max: 20,

                title: {

                    display: true,

                    text: "Tinggi Air (cm)"

                }

            },

            x: {

                title: {

                    display: true,

                    text: "Waktu"

                }

            }

        }

    }

});


// ==========================================
// STATUS KONEKSI
// ==========================================

function setConnection(online) {

    if (connectionDot) {

        if (online) {

            connectionDot.style.background =
                "#4ade80";

            connectionDot.style.boxShadow =
                "0 0 14px rgba(74,222,128,.8)";

        } else {

            connectionDot.style.background =
                "#fb5b65";

            connectionDot.style.boxShadow =
                "0 0 14px rgba(251,91,101,.8)";

        }

    }


    if (connectionText) {

        connectionText.textContent =
            online
                ? "Terhubung"
                : "Terputus";

    }

}


// ==========================================
// STATUS AIR
// ==========================================

function updateStatus(status) {

    status =
        String(status || "ERROR")
            .trim()
            .toUpperCase();


    statusElement.textContent =
        status;


    // ======================================
    // NORMAL
    // ======================================

    if (status === "NORMAL") {

        statusIcon.textContent =
            "🟢";

        statusDescription.textContent =
            "Kondisi air masih aman";

        statusCard.style.borderColor =
            "rgba(74,222,128,.35)";

        statusBadge.textContent =
            "SYSTEM NORMAL";

        statusBadge.style.color =
            "#4ade80";

        statusBadge.style.background =
            "rgba(74,222,128,.12)";

    }


    // ======================================
    // WASPADA
    // ======================================

    else if (status === "WASPADA") {

        statusIcon.textContent =
            "🟡";

        statusDescription.textContent =
            "Ketinggian air mulai meningkat";

        statusCard.style.borderColor =
            "rgba(250,204,21,.45)";

        statusBadge.textContent =
            "PERLU WASPADA";

        statusBadge.style.color =
            "#facc15";

        statusBadge.style.background =
            "rgba(250,204,21,.12)";

    }


    // ======================================
    // BAHAYA
    // ======================================

    else if (status === "BAHAYA") {

        statusIcon.textContent =
            "🔴";

        statusDescription.textContent =
            "PERINGATAN! Ketinggian air berbahaya";

        statusCard.style.borderColor =
            "rgba(251,91,101,.55)";

        statusBadge.textContent =
            "BAHAYA";

        statusBadge.style.color =
            "#fb5b65";

        statusBadge.style.background =
            "rgba(251,91,101,.12)";

    }


    // ======================================
    // ERROR
    // ======================================

    else {

        statusIcon.textContent =
            "⚠️";

        statusDescription.textContent =
            "Sensor tidak dapat membaca data";

        statusCard.style.borderColor =
            "rgba(148,163,184,.35)";

        statusBadge.textContent =
            "SENSOR ERROR";

        statusBadge.style.color =
            "#94a3b8";

        statusBadge.style.background =
            "rgba(148,163,184,.12)";

    }

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard(

    jarak,
    tinggiAir,
    statusAir,
    alarm

) {

    // ======================================
    // JARAK
    // ======================================

    if (Number.isFinite(Number(jarak))) {

        jarakElement.textContent =
            Number(jarak).toFixed(1);

    } else {

        jarakElement.textContent =
            "--";

    }


    // ======================================
    // TINGGI AIR
    // ======================================

    if (Number.isFinite(Number(tinggiAir))) {

        tinggiAirElement.textContent =
            Number(tinggiAir).toFixed(1);

    } else {

        tinggiAirElement.textContent =
            "--";

    }


    // ======================================
    // STATUS
    // ======================================

    updateStatus(statusAir);


    // ======================================
    // ALARM
    // ======================================

    alarmElement.textContent =
        Number(alarm) === 1
            ? "ON"
            : "OFF";


    // ======================================
    // WAKTU
    // ======================================

    const now =
        new Date();

    lastUpdate.textContent =
        now.toLocaleTimeString("id-ID");


    // ======================================
    // GRAFIK
    // ======================================

    if (Number.isFinite(Number(tinggiAir))) {

        const waktu =
            now.toLocaleTimeString(
                "id-ID",
                {
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        waterChart.data.labels.push(
            waktu
        );


        waterChart.data.datasets[0].data.push(
            Number(tinggiAir)
        );


        // Maksimal 30 data

        if (
            waterChart.data.labels.length > 30
        ) {

            waterChart.data.labels.shift();

            waterChart.data.datasets[0].data.shift();

        }


        waterChart.update();

    }

}


// ==========================================
// AMBIL DATA DARI API VERCEL
// ==========================================

async function loadBlynkData() {

    try {

        const response =
            await fetch(
                "/api/blynk",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `API Error: ${response.status}`
            );

        }


        const data =
            await response.json();


        // ==================================
        // CEK HASIL API
        // ==================================

        if (!data.berhasil) {

            throw new Error(
                data.error ||
                "API gagal mengambil data"
            );

        }


        // ==================================
        // UPDATE WEBSITE
        // ==================================

        updateDashboard(

            data.jarak,

            data.tinggiAir,

            data.status,

            data.alarm

        );


        // ==================================
        // KONEKSI BERHASIL
        // ==================================

        setConnection(true);


        console.log(
            "Data Blynk:",
            data
        );

    }


    catch (error) {

        console.error(
            "Gagal mengambil data:",
            error
        );


        setConnection(false);

    }

}


// ==========================================
// STATUS AWAL
// ==========================================

updateStatus("NORMAL");

setConnection(false);


// ==========================================
// DATA PERTAMA
// ==========================================

loadBlynkData();


// ==========================================
// UPDATE SETIAP 2 DETIK
// ==========================================

setInterval(

    loadBlynkData,

    2000

);
