let koreanWords = [];
let currentWordIndex = -1; // Đặt giá trị ban đầu là -1
let score = 0;
let wrongCount = 0; // Khởi tạo biến đếm số từ sai

document.getElementById('uploadExcel').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (!file) {
        alert('Vui lòng chọn một tệp Excel.');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (json.length === 0) {
                alert('Tệp Excel không chứa dữ liệu.');
                return;
            }

            koreanWords = json.map(row => ({ korean: row[0], vietnamese: row[1] }));

            // Chọn từ ngẫu nhiên
            currentWordIndex = Math.floor(Math.random() * koreanWords.length);
            displayWord();
            document.getElementById('wordContainer').style.display = 'block';
        } catch (error) {
            alert('Có lỗi khi xử lý tệp: ' + error.message);
        }
    };

    reader.readAsArrayBuffer(file);
});

document.getElementById('checkButton').addEventListener('click', function() {
    const inputKorean = document.getElementById('inputKorean').value.trim();
    const currentKoreanWord = koreanWords[currentWordIndex].korean;

    if (inputKorean === currentKoreanWord) {
        score++;
        document.getElementById('resultMessage').innerHTML = '<i class="fas fa-check" style="color: green;"></i> Đúng!';
    } else {
        wrongCount++; // Tăng biến đếm số từ sai
        document.getElementById('resultMessage').innerHTML = '<i class="fas fa-times" style="color: red;"></i> Sai! Từ đúng là: ' + currentKoreanWord;
    }
    
    document.getElementById('score').innerText = 'Điểm: ' + score;
    document.getElementById('wrongCount').innerText = 'Số từ sai: ' + wrongCount; // Hiển thị số từ sai
});

document.getElementById('nextButton').addEventListener('click', function() {
    // Chọn từ ngẫu nhiên mới
    currentWordIndex = Math.floor(Math.random() * koreanWords.length);
    displayWord();
    document.getElementById('resultMessage').innerHTML = '';
    document.getElementById('inputKorean').value = ''; // Đặt lại ô nhập liệu
});

function displayWord() {
    document.getElementById('vietnameseMeaning').innerText = koreanWords[currentWordIndex].vietnamese;
    document.getElementById('score').innerText = 'Điểm: ' + score;
    document.getElementById('wrongCount').innerText = 'Số từ sai: ' + wrongCount; // Cập nhật số từ sai
}
