// Validação e funcionalidades do formulário
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade de rolagem suave para o botão CTA
    const ctaButton = document.querySelector('.cta-button');
    const formSection = document.getElementById('form-section');
    
    // Função para rolagem suave customizada
    function smoothScrollTo(targetElement, duration = 2000) {
        const targetPosition = targetElement.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Função de easing para movimento mais suave (easeInOutCubic)
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    if (ctaButton && formSection) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Rolagem suave customizada para a seção do formulário (2 segundos)
            smoothScrollTo(formSection, 1300);
        });
    }
    const form = document.getElementById('contactForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const whatsappInput = document.getElementById('whatsapp');
    const submitBtn = form.querySelector('.submit-btn');

    // Máscara para WhatsApp
    whatsappInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length <= 10) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }
        }
        
        e.target.value = value;
    });

    // Validação em tempo real
    function validateField(field, validator, errorElement) {
        const value = field.value.trim();
        const isValid = validator(value);
        
        const formGroup = field.closest('.form-group');
        
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            errorElement.classList.remove('show');
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            errorElement.classList.add('show');
        }
        
        return isValid;
    }

    // Validadores
    const validators = {
        fullName: (value) => {
            if (!value) return false;
            if (value.length < 2) return false;
            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return false;
            return true;
        },
        
        email: (value) => {
            if (!value) return false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },
        
        whatsapp: (value) => {
            if (!value) return false;
            const cleanValue = value.replace(/\D/g, '');
            return cleanValue.length === 11;
        }
    };

    // Mensagens de erro
    const errorMessages = {
        fullName: 'Nome deve ter pelo menos 2 caracteres e conter apenas letras',
        email: 'Por favor, insira um e-mail válido',
        whatsapp: 'WhatsApp deve ter 11 dígitos (DDD + número)'
    };

    // Event listeners para validação em tempo real
    fullNameInput.addEventListener('blur', function() {
        const errorElement = document.getElementById('fullNameError');
        const isValid = validateField(this, validators.fullName, errorElement);
        
        if (!isValid) {
            errorElement.textContent = errorMessages.fullName;
        }
    });

    emailInput.addEventListener('blur', function() {
        const errorElement = document.getElementById('emailError');
        const isValid = validateField(this, validators.email, errorElement);
        
        if (!isValid) {
            errorElement.textContent = errorMessages.email;
        }
    });

    whatsappInput.addEventListener('blur', function() {
        const errorElement = document.getElementById('whatsappError');
        const isValid = validateField(this, validators.whatsapp, errorElement);
        
        if (!isValid) {
            errorElement.textContent = errorMessages.whatsapp;
        }
    });

    // Validação completa do formulário
    function validateForm() {
        const fields = [
            { input: fullNameInput, validator: validators.fullName, errorId: 'fullNameError', message: errorMessages.fullName },
            { input: emailInput, validator: validators.email, errorId: 'emailError', message: errorMessages.email },
            { input: whatsappInput, validator: validators.whatsapp, errorId: 'whatsappError', message: errorMessages.whatsapp }
        ];

        let isFormValid = true;

        fields.forEach(field => {
            const errorElement = document.getElementById(field.errorId);
            const isValid = validateField(field.input, field.validator, errorElement);
            
            if (!isValid) {
                errorElement.textContent = field.message;
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll para o primeiro campo com erro
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Simular envio do formulário
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Enviar dados para o servidor
        const formData = {
            nomeCompleto: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            whatsapp: whatsappInput.value.trim()
        };

        fetch('/api/save-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('Status da resposta:', response.status); // Debug
            return response.json().then(data => {
                console.log('Resposta do servidor:', data); // Debug
                console.log('Verificando se é e-mail duplicado...'); // Debug
                
                // TESTE: Sempre mostrar mensagem de usuário já cadastrado para debug
                if (response.status === 409 || 
                    (data.message && (
                        data.message.includes('já está cadastrado') || 
                        data.message.includes('Este e-mail já está cadastrado') ||
                        data.message.includes('cadastrado')
                    )) ||
                    data.message === 'Erro interno do servidor') { // TESTE: Adicionar esta condição
                    console.log('Mostrando mensagem de usuário já cadastrado'); // Debug
                    showAlreadyRegisteredMessage();
                    return;
                }
                
                if (data.success) {
                    console.log('Redirecionando para página de agradecimento'); // Debug
                    // Redirecionar para página de agradecimento
                    window.location.href = '/thank-you.html';
                } else {
                    console.log('Mostrando mensagem de erro genérica'); // Debug
                    showErrorMessage(data.message);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
            // Só mostrar erro de conexão se não for um erro de resposta HTTP
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                showErrorMessage('Erro de conexão. Tente novamente.');
            } else {
                showErrorMessage('Erro interno. Tente novamente.');
            }
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    });

    // Função para mostrar mensagem de sucesso
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Cadastro realizado com sucesso!</h3>
                <p>Obrigado por se cadastrar. Em breve você receberá nosso conteúdo exclusivo.</p>
                <button  class="close-btn">Fechar</button>
            </div>
        `;
        
        // Adicionar estilos para a mensagem de sucesso
        successMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        const successContent = successMessage.querySelector('.success-content');
        successContent.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        `;
        
        successMessage.querySelector('i').style.cssText = `
            font-size: 3rem;
            color: #10b981;
            margin-bottom: 20px;
        `;
        
        successMessage.querySelector('h3').style.cssText = `
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 12px;
        `;
        
        successMessage.querySelector('p').style.cssText = `
            color: #6b7280;
            margin-bottom: 24px;
            line-height: 1.6;
        `;
        
        successMessage.querySelector('.close-btn').style.cssText = `
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.3s ease;
        `;
        
        const closeBtn = successMessage.querySelector('.close-btn');
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = '#5a67d8';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = '#667eea';
        });
        
        closeBtn.addEventListener('click', function() {
            successMessage.remove();
        });
        
        document.body.appendChild(successMessage);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (successMessage.parentElement) {
                successMessage.remove();
            }
        }, 5000);
    }

    // Função para mostrar mensagem de usuário já cadastrado
    function showAlreadyRegisteredMessage() {
        console.log('Executando showAlreadyRegisteredMessage()'); // Debug
        const alreadyRegisteredMessage = document.createElement('div');
        alreadyRegisteredMessage.className = 'already-registered-message';
        alreadyRegisteredMessage.innerHTML = `
            <div class="already-registered-content">
                <i class="fas fa-user-check"></i>
                <h3>Você já está cadastrado!</h3>
                <p>Este e-mail já está em nossa base de dados. Você receberá nosso conteúdo exclusivo em breve!</p>
                <div class="already-registered-actions">
                    <button class="btn-entrar-app">Entrar na plataforma</button>
                    <button class="close-btn">Fechar</button>
                </div>
            </div>
        `;
        
        // Adicionar estilos para a mensagem de usuário já cadastrado
        alreadyRegisteredMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        const alreadyRegisteredContent = alreadyRegisteredMessage.querySelector('.already-registered-content');
        alreadyRegisteredContent.style.cssText = `
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(139, 92, 246, 0.3);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 450px;
            margin: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;
        
        alreadyRegisteredMessage.querySelector('i').style.cssText = `
            font-size: 3rem;
            color: #8B5CF6;
            margin-bottom: 20px;
        `;
        
        alreadyRegisteredMessage.querySelector('h3').style.cssText = `
            font-size: 1.5rem;
            font-weight: 600;
            color: white;
            margin-bottom: 12px;
        `;
        
        alreadyRegisteredMessage.querySelector('p').style.cssText = `
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 24px;
            line-height: 1.6;
        `;
        
        const actionsDiv = alreadyRegisteredMessage.querySelector('.already-registered-actions');
        actionsDiv.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        `;
        
        const btnEntrarApp = alreadyRegisteredMessage.querySelector('.btn-entrar-app');
        btnEntrarApp.style.cssText = `
            background: linear-gradient(135deg, #8B5CF6, #A855F7);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        `;
        
        const closeBtn = alreadyRegisteredMessage.querySelector('.close-btn');
        closeBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        `;
        
        // Event listeners para os botões
        btnEntrarApp.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
        });
        
        btnEntrarApp.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        btnEntrarApp.addEventListener('click', function() {
            // Redirecionar para a página de agradecimento
            window.location.href = '/thank-you.html';
        });
        
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });
        
        closeBtn.addEventListener('click', function() {
            alreadyRegisteredMessage.remove();
        });
        
        document.body.appendChild(alreadyRegisteredMessage);
        
        // Remover automaticamente após 8 segundos
        setTimeout(() => {
            if (alreadyRegisteredMessage.parentElement) {
                alreadyRegisteredMessage.remove();
            }
        }, 8000);
    }

    // Função para mostrar mensagem de erro
    function showErrorMessage(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message-modal';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ops! Algo deu errado</h3>
                <p>${message}</p>
                <button  class="close-btn">Fechar</button>
            </div>
        `;
        
        // Adicionar estilos para a mensagem de erro
        errorMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        const errorContent = errorMessage.querySelector('.error-content');
        errorContent.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        `;
        
        errorMessage.querySelector('i').style.cssText = `
            font-size: 3rem;
            color: #ef4444;
            margin-bottom: 20px;
        `;
        
        errorMessage.querySelector('h3').style.cssText = `
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 12px;
        `;
        
        errorMessage.querySelector('p').style.cssText = `
            color: #6b7280;
            margin-bottom: 24px;
            line-height: 1.6;
        `;
        
        errorMessage.querySelector('.close-btn').style.cssText = `
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.3s ease;
        `;
        
        const closeBtn = errorMessage.querySelector('.close-btn');
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = '#dc2626';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = '#ef4444';
        });
        
        closeBtn.addEventListener('click', function() {
            errorMessage.remove();
        });
        
        document.body.appendChild(errorMessage);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (errorMessage.parentElement) {
                errorMessage.remove();
            }
        }, 5000);
    }

    // Adicionar animação fadeIn
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
