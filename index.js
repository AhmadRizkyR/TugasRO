
function hitungEOQ() {
    let demand = parseInt(document.getElementById('demand').value.replaceAll(".", ""));
    let biayaPemesanan = parseInt(document.getElementById('biayaPemesanan').value.replaceAll(".", ""));
    let biayaPenyimpanan = parseInt(document.getElementById('biayaPenyimpanan').value.replaceAll(".", ""));
    let leadTime = parseInt(document.getElementById('leadTime').value.replaceAll(".", ""));
    let hargaPerUnit = parseInt(document.getElementById('hargaPerUnit').value.replaceAll(".", ""));
    let safetyStock = parseInt(document.getElementById('safetyStock').value.replaceAll(".", ""));

    let selectedBiayaPenyimpanan = $("#pilihBiayaPenyimpanan").val();
    let EOQ = 0;
    let eoqTxt = `<span>&#8730;(2 * Demand * Biaya Pemesanan) / (Biaya Penyimpanan)</span>`;
    let eoqTxt2 = `<span>&#8730;(2 * ${demand} * ${biayaPemesanan}) / (${biayaPenyimpanan})</span>`;
    let ropTxt = `<span>Safety Stock + Leadtime</span>`;

    if (selectedBiayaPenyimpanan == "rataPersediaan") {
        eoqTxt = `<span>&#8730;(2 * Demand * Biaya Pemesanan) / (Harga Barang * Persentase Biaya Simpan)</span>`;
        eoqTxt2 = `<span>&#8730;(2 * ${demand} * ${biayaPemesanan}) / (${hargaPerUnit} * ${biayaPenyimpanan}%)<br>
                    &emsp;&emsp;&nbsp= &#8730;(2 * ${demand} * ${biayaPemesanan}) / ${hargaPerUnit * biayaPenyimpanan / 100}</span>`;
        biayaPenyimpanan = (biayaPenyimpanan / 100 * hargaPerUnit);
    }

    EOQ = Math.sqrt((2 * demand * biayaPemesanan) / biayaPenyimpanan);

    if (isNaN(safetyStock)) {
        safetyStock = 1.96 * Math.sqrt(leadTime);
        safetyStock = safetyStock.toFixed(0);
    }

    // let ROP = (demand / 365).toFixed(0) * (leadTime * (demand/12)) + safetyStock;
    var dailyDemand = demand / 360;
    var ROP = dailyDemand * leadTime + safetyStock;
    let ropTxt2 = `<span>${safetyStock} + (${leadTime} * ${demand}/360)<br>
                    &emsp;&emsp;&nbsp = ${formatRupiah(ROP.toFixed(0))}</span>`;

    document.getElementById('hasilPengendalian').innerHTML = `
            <div class="alert alert-success" role="alert">
                <h4>Evaluasi Kalkulasi : </h4>
                <strong>EOQ </strong> = ${eoqTxt}<br>
                <strong>&emsp;&emsp;&nbsp;</strong>= ${eoqTxt2}<br>
                &emsp;&emsp;&nbsp;= ${formatRupiah(EOQ.toFixed(0))} Unit (Kuantitas Paling Optimal)<br>
                <strong>ROP </strong> = ${ropTxt}<br>
                <strong>&emsp;&emsp;&nbsp;</strong>= ${ropTxt2} Unit
            </div>
            `;

    // Menampilkan grafik EOQ
    $("#grafikEOQ").remove();
    $("#grafikData").append('<canvas id="grafikEOQ" width="400" height="200" class="mt-4"></canvas>');
    var ctx = document.getElementById('grafikEOQ').getContext('2d');
    let config = {
        type: 'line',
        data: {
            labels: ['EOQ', 'ROP', 'Safety Stock', 'EOQ', 'ROP', 'Safety Stock', 'EOQ', 'ROP', 'Safety Stock'],
            datasets: [{
                label: "Grafik Hubungan ROP, Safety Stock, dan Lead Time",
                data: [EOQ.toFixed(2), ROP, safetyStock, EOQ.toFixed(2), ROP, safetyStock, EOQ.toFixed(2), ROP, safetyStock],
                backgroundColor: ['red', 'green', 'blue'],
                borderColor: '#4287f5',
            },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    };

    let chart = new Chart(ctx, config);
    $("html, body").animate({
        scrollTop: $("#grafikEOQ").offset().top
    }, 1000);
}

function formatRupiah(angka, prefix) {
    angka = angka.toString();
    var number_string = angka.replace(/[^,\d]/g, "").toString(),
        split = number_string.split(","),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
    return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
}

$(".format-rupiah").keyup(function () {
    this.value = formatRupiah(String(this.value));
});