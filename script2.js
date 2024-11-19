
// Função para validar o formulário de contato
function validateForm(event) {
    event.preventDefault(); // Impede o envio padrão do formulário para realizar validações

    // Pegando os valores dos campos
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validação simples dos campos
    if (name === "" || email === "" || message === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Validação de email (expressão regular básica)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Por favor, insira um endereço de e-mail válido.");
        return;
    }

    // Se a validação passar, exibe a mensagem de sucesso na tela
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.innerText = 'Mensagem enviada! Em breve respondemos seu contato.';
    
    // Exibe a mensagem de sucesso abaixo do formulário
    document.querySelector('.contact-container').appendChild(successMessage);
    
    // Limpa o formulário
    document.querySelector('.contact-form').reset();
}

// Atribui o evento de envio ao formulário
document.querySelector('.contact-form').addEventListener('submit', validateForm);
