$(document).ready(function () {
    let total = 0;

    // Tambah Baris Baru
    $('#add-item').click(function () {
        const newRow = `
            <tr>
                <td><input type="text" class="form-control item" placeholder="Nama Item" required></td>
                <td><input type="number" class="form-control qty" min="0" step="0.01" required></td>
                <td><input type="number" class="form-control price" min="0" step="0.01" required></td>
                <td><input type="number" class="form-control subtotal" readonly></td>
                <td><span class="delete-btn">🗑</span></td>
            </tr>`;
        $('#sales-table tbody').append(newRow);
    });

    // Hapus Baris
    $(document).on('click', '.delete-btn', function () {
        $(this).closest('tr').remove();
        calculateTotal();
    });

    // Hitung SubTotal dan Total saat Qty atau Harga berubah
    $(document).on('input', '.qty, .price', function () {
        const row = $(this).closest('tr');
        const qty = parseFloat(row.find('.qty').val()) || 0;
        const price = parseFloat(row.find('.price').val()) || 0;
        const subtotal = qty * price;

        row.find('.subtotal').val(subtotal.toFixed(2));
        calculateTotal();
    });

    // Hitung Total Keseluruhan
    function calculateTotal() {
        total = 0;
        $('.subtotal').each(function () {
            total += parseFloat($(this).val()) || 0;
        });
        $('#total').val(total.toFixed(2));
        calculateChange();
    }

    // Hitung Kembalian
    $('#cash').on('input', function () {
        calculateChange();
    });

    function calculateChange() {
        const cash = parseFloat($('#cash').val()) || 0;
        const change = cash - total;
        $('#change').val(change.toFixed(2));
    }

    // Submit Form
    $('#sales-form').submit(function (e) {
        e.preventDefault();

        const data = {
            NamaPelanggan: $('#customer-name').val(),
            Tanggal: $('#sale-date').val(),
            Jam: $('#sale-time').val(),
            Total: total,
            BayarTunai: parseFloat($('#cash').val()) || 0,
            Kembali: parseFloat($('#change').val()) || 0,
            DetilPenjualan: []
        };

        $('#sales-table tbody tr').each(function () {
            const item = $(this).find('.item').val();
            const qty = parseFloat($(this).find('.qty').val()) || 0;
            const price = parseFloat($(this).find('.price').val()) || 0;
            const subtotal = parseFloat($(this).find('.subtotal').val()) || 0;

            data.DetilPenjualan.push({ Item: item, Qty: qty, HargaSatuan: price, SubTotal: subtotal });
        });

        alert(JSON.stringify(data, null, 2));
    });
});
