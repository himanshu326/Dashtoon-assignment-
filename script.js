const BASE_URL = 'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud';
let panelCount = 0; // Counter to track panel count

async function query(data) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      headers: {
        Accept: 'image/png',
        Authorization: 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.blob();
  } catch (error) {
    throw new Error('API request failed');
  }
}

function generatePanel() {
    if (panelCount >= 10) {
        displayError('You have reached the maximum panel limit (10 panels)');
        return;
    }

    const textInput = document.getElementById('textInput').value;

    // Clear input box
    document.getElementById('textInput').value = '';

    // Create a placeholder for the panel
    const panelContainer = document.getElementById('panelContainer');
    const panelDiv = document.createElement('div');
    panelDiv.classList.add('panel', 'loading');
    panelDiv.textContent = `Panel ${panelCount + 1}: ${textInput}`;
    panelContainer.appendChild(panelDiv);
    panelCount++;
    

    query({ inputs: textInput })
        .then((imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        displayPanel(imageUrl, textInput, panelDiv);
        clearError();
        if (panelCount === 10) {
            displayError('You have reached the maximum panel limit (10 panels)');
            disableForm();
        }
        })
        .catch(() => {
        displayError('Failed to generate panel. Please try again.');
        panelDiv.remove(); // Remove the placeholder if fetching fails
    });
}

function displayPanel(imageSrc, text, panelDiv) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Generated Panel';
    img.onload = () => {
        panelDiv.classList.remove('loading');
        // panelDiv.textContent = `Panel ${panelCount}: ${text}`;
        panelDiv.appendChild(img);
    };
}
  

function displayError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
}

function clearError() {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = '';
}

function disableForm() {
  const textInput = document.getElementById('textInput');
  const generateButton = document.querySelector('.form-container button');
  textInput.disabled = true;
  generateButton.disabled = true;
}
