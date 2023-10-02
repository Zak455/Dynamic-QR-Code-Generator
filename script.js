document.addEventListener("DOMContentLoaded", function () {
    const generateQRButton = document.getElementById("generateQR");
    const resetQRButton = document.getElementById("resetQR");
    const downloadQRButton = document.getElementById("downloadQR");
    const inputData = document.getElementById("inputData");
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 128,
        height: 128,
    });
    const errorMessage = document.getElementById("error-message");

    function generateQRCode() {
        const data = inputData.value.trim();
        if (data) {
            qrcode.clear(); // Clear any previous QR code
            qrcode.makeCode(data);
            document.getElementById("qrcode").classList.add("show-img");
            errorMessage.style.display = "none"; // Hide the error message on success
            
            // Show the Reset and Download buttons
            resetQRButton.style.display = "block";
            downloadQRButton.style.display = "block";
        } else {
            // Add the shake animation class to the input box on error
            inputData.classList.add("shake");

            // Remove the shake animation class after the animation completes
            inputData.addEventListener("animationend", () => {
                inputData.classList.remove("shake");
            });

            // Show the error message
            errorMessage.style.display = "block";
            errorMessage.textContent = "Please enter text or a URL to generate a QR code.";
        }
    }

    generateQRButton.addEventListener("click", generateQRCode);

    // Listen for Enter key press in the input field
    inputData.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            generateQRCode();
        }
    });

    resetQRButton.addEventListener("click", () => {
        // Clear the input and QR code
        inputData.value = "";
        qrcode.clear();
        document.getElementById("qrcode").classList.remove("show-img");
        errorMessage.style.display = "none"; // Hide the error message on reset
        
        // Hide the Reset and Download buttons after resetting
        resetQRButton.style.display = "none";
        downloadQRButton.style.display = "none";
    });

    downloadQRButton.addEventListener("click", () => {
        const canvas = document.querySelector("#qrcode canvas");
        if (canvas) {
            // Prompt the user to choose the download format
            let format = prompt("Choose download format (jpg, png, or svg):");
            if (format !== null) { // Check if a format was provided (not canceled)
                format = format.toLowerCase(); // Convert format to lowercase
                const link = document.createElement("a");
                if (format === "jpg" || format === "png" || format === "svg") {
                    link.download = `qrcode.${format}`;
                    
                    if (format === "svg") {
                        // For SVG format, use the XML serializer
                        const svgData = new XMLSerializer().serializeToString(canvas);
                        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
                        link.href = URL.createObjectURL(blob);
                    } else {
                        // For JPG and PNG formats, use the canvas toDataURL method
                        link.href = canvas.toDataURL(`image/${format}`);
                    }

                    // Trigger the download
                    link.click();
                } else {
                    alert("Invalid format. Please choose jpg, png, or svg.");
                }
            }
        } else {
            alert("Generate a QR code first before downloading.");
        }
    });
});
