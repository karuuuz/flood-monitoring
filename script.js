// ==========================================
// DATA SIMULASI
// ==========================================

let jarak = 12.5;
let tinggiAir = 7.5;
let statusAir = "NORMAL";
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
// UPDATE DASHBOARD
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
    // WAKTU
    // ==============================

    const now = new Date();

    lastUpdate.textContent =
        now.toLocaleTimeString("id-ID");

}


// ==========================================
// SIMULASI DATA SENSOR
// ==========================================

function simulasiSensor() {

    // membuat perubahan air secara random

    tinggiAir +=
        (Math.random() - 0.5) * 2;


    if (tinggiAir < 0) {
        tinggiAir = 0;
    }

    if (tinggiAir > 20) {
        tinggiAir = 20;
    }


    // hitung jarak

    jarak =
        20 - tinggiAir;


    // tentukan status

    if (jarak <= 5) {

        statusAir = "BAHAYA";

        alarm = 1;

    }

    else if (jarak <= 10) {

        statusAir = "WASPADA";

        alarm = 1;

    }

    else {

        statusAir = "NORMAL";

        alarm = 0;

    }


    // update dashboard

    updateDashboard();


    // update grafik

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


    // maksimal 20 data

    if (
        waterChart.data.labels.length > 20
    ) {

        waterChart.data.labels.shift();

        waterChart.data.datasets[0].data.shift();

    }


    waterChart.update();

}


// ==========================================
// JALANKAN
// ==========================================

updateDashboard();


// simulasi setiap 2 detik

setInterval(
    simulasiSensor,
    2000
);