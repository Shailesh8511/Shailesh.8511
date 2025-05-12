document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');
    const fixBtn = document.getElementById('fixBtn');
    let selectedFile = null;
    
    // Drag and drop functionality
    dropArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length) {
            handleFileSelection(e.target.files[0]);
        }
    });
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleFileSelection(file);
    });
    
    function handleFileSelection(file) {
        // Check for Word file types
        const validTypes = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        const validExtensions = ['.doc', '.docx'];
        
        if (validTypes.includes(file.type) || 
            validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
            
            selectedFile = file;
            dropArea.innerHTML = `<p>Selected file: <strong>${file.name}</strong></p>`;
            fixBtn.disabled = false;
        } else {
            alert('Sorry, only Word files (.doc, .docx) are accepted.');
            fixBtn.disabled = true;
        }
    }
    
    fixBtn.addEventListener('click', function() {
        if (!selectedFile) return;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // In a real implementation, you would process the file here
            // For this example, we'll just download the original file
            // For actual font fixing, you would need to parse the DOCX file
            
            const blob = new Blob([e.target.result], {type: selectedFile.type});
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fixed_' + selectedFile.name;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        };
        
        reader.readAsArrayBuffer(selectedFile);
    });
});
