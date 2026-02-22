// Diabetes Compass - Interactive Home Page with Contextual Banner
document.addEventListener('DOMContentLoaded', function () {

    // Contextual Diabetes Facts Banner Functionality
    const diabetesFactsContextual = {
        morning: [
            "Good morning! Starting your day with a protein-rich breakfast helps maintain stable blood sugar levels throughout the morning.",
            "Morning tip: A 10-minute walk after breakfast can reduce post-meal blood sugar spikes by up to 30%.",
            "Did you know? Morning sunlight exposure for 15-20 minutes can help regulate your circadian rhythm and improve glucose metabolism."
        ],
        afternoon: [
            "Afternoon reminder: If you're feeling tired, it might be your blood sugar. Stay hydrated and consider a healthy snack.",
            "Lunch fact: Eating vegetables first during meals can slow glucose absorption and improve blood sugar control.",
            "Midday tip: Stress management through deep breathing can lower cortisol and help stabilize blood glucose levels."
        ],
        evening: [
            "Evening insight: A light dinner 3 hours before bed can improve overnight glucose control and sleep quality.",
            "Dinner tip: Adding cinnamon to your meals may help improve insulin sensitivity - try it with yogurt or oatmeal!",
            "Good evening! Gentle stretching or yoga before bed can reduce morning blood sugar levels."
        ],
        general: [
            "Over 422 million people worldwide have diabetes, and this number is rapidly increasing every year.",
            "Type 2 diabetes accounts for about 90% of all diabetes cases and can often be prevented through healthy lifestyle choices.",
            "Regular physical activity can reduce the risk of developing type 2 diabetes by up to 58%.",
            "People with diabetes have a 2-4 times higher risk of heart disease, making cardiovascular care crucial.",
            "Early detection and proper management can help prevent or delay diabetes complications significantly."
        ],
        seasonal: {
            winter: "Winter tip: Indoor activities like dancing, yoga, or home workouts can help maintain fitness when it's cold outside.",
            spring: "Spring renewal: This is a great time to start a diabetes-friendly garden with fresh herbs and vegetables!",
            summer: "Summer safety: Stay extra hydrated as heat can affect blood sugar levels. Check levels more frequently.",
            fall: "Fall preparation: Use this season to establish healthy routines that will carry you through the holidays."
        }
    };

    function getContextualFacts() {
        const hour = new Date().getHours();
        const month = new Date().getMonth();

        let timeContext;
        if (hour < 12) timeContext = 'morning';
        else if (hour < 18) timeContext = 'afternoon';
        else timeContext = 'evening';

        let season;
        if (month >= 2 && month <= 4) season = 'spring';
        else if (month >= 5 && month <= 7) season = 'summer';
        else if (month >= 8 && month <= 10) season = 'fall';
        else season = 'winter';

        // Mix contextual and general facts
        let facts = [...diabetesFactsContextual[timeContext]];
        facts.push(diabetesFactsContextual.seasonal[season]);
        facts.push(...diabetesFactsContextual.general.slice(0, 2));

        return facts;
    }

    const diabetesFacts = getContextualFacts();

    let currentFactIndex = 0;
    let factInterval;

    const factElement = document.getElementById('diabetes-fact');
    const prevBtn = document.getElementById('prev-fact');
    const nextBtn = document.getElementById('next-fact');
    const indicators = document.querySelectorAll('.indicator');

    function updateFact(index) {
        if (factElement) {
            currentFactIndex = index;

            // Enhanced slide-out animation
            factElement.style.transform = 'translateX(-100px)';
            factElement.style.opacity = '0';

            setTimeout(() => {
                factElement.textContent = "DID YOU KNOW? " + diabetesFacts[currentFactIndex];
                factElement.style.transform = 'translateX(100px)';

                setTimeout(() => {
                    factElement.style.transform = 'translateX(0)';
                    factElement.style.opacity = '1';
                }, 50);
            }, 300);

            // Update indicators with stagger animation
            indicators.forEach((indicator, i) => {
                setTimeout(() => {
                    indicator.classList.toggle('active', i === currentFactIndex);
                    if (i === currentFactIndex) {
                        indicator.style.transform = 'scale(1.4) rotate(180deg)';
                        setTimeout(() => {
                            indicator.style.transform = 'scale(1.3)';
                        }, 200);
                    }
                }, i * 100);
            });
        }
    }

    function nextFact() {
        const nextIndex = (currentFactIndex + 1) % diabetesFacts.length;
        updateFact(nextIndex);
    }

    function prevFact() {
        const prevIndex = (currentFactIndex - 1 + diabetesFacts.length) % diabetesFacts.length;
        updateFact(prevIndex);
    }

    function startAutoRotation() {
        factInterval = setInterval(() => {
            // Add banner pulse before fact change
            const banner = document.querySelector('.did-you-know-banner');
            if (banner) {
                banner.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    banner.style.transform = 'scale(1)';
                }, 200);
            }
            nextFact();
        }, 6000); // Slower rotation for contextual reading
    }

    function stopAutoRotation() {
        if (factInterval) {
            clearInterval(factInterval);
        }
    }

    // Initialize contextual banner
    function initializeContextualBanner() {
        const banner = document.querySelector('.did-you-know-banner');
        const hour = new Date().getHours();

        // Apply contextual styling based on time of day
        if (hour < 12) {
            banner.classList.add('banner-morning');
        } else if (hour < 18) {
            banner.classList.add('banner-afternoon');
        } else {
            banner.classList.add('banner-evening');
        }

        // Add particle effects
        if (!banner.querySelector('.banner-particles')) {
            const particles = document.createElement('div');
            particles.className = 'banner-particles';
            banner.appendChild(particles);
        }
    }

    // Initialize banner if elements exist
    if (factElement) {
        initializeContextualBanner();
        updateFact(0);
        startAutoRotation();

        // Add event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoRotation();
                nextFact();
                startAutoRotation();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoRotation();
                prevFact();
                startAutoRotation();
            });
        }

        // Indicator click events
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoRotation();
                updateFact(index);
                startAutoRotation();
            });
        });

        // Pause auto-rotation on hover
        const banner = document.querySelector('.did-you-know-banner');
        if (banner) {
            banner.addEventListener('mouseenter', stopAutoRotation);
            banner.addEventListener('mouseleave', startAutoRotation);
        }
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to tiles when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initialize tile animations
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(20px)';
        tile.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(tile);
    });

    // Add tile click tracking for analytics (optional)
    tiles.forEach(tile => {
        tile.addEventListener('click', function () {
            const tileTitle = this.querySelector('h3').textContent;
            console.log(`Tile clicked: ${tileTitle}`);

            // You can add analytics tracking here
            // Example: gtag('event', 'tile_click', { 'tile_name': tileTitle });
        });
    });

    // Add loading state management
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });

    document.addEventListener('mousedown', function (e) {
        document.body.classList.remove('user-is-tabbing');
    });

    // Add responsive menu toggle for future navigation
    function addMobileMenuToggle() {
        const header = document.querySelector('header');
        if (window.innerWidth <= 768 && !header.querySelector('.mobile-menu-toggle')) {
            // Placeholder for future mobile menu implementation
            console.log('Mobile view detected - ready for mobile navigation');
        }
    }

    // Check for mobile view on load and resize
    addMobileMenuToggle();
    window.addEventListener('resize', addMobileMenuToggle);

    // Add error handling for missing images (both tile images and icons)
    document.querySelectorAll('.tile-icon img').forEach(img => {
        img.addEventListener('error', function () {
            // Create a fallback icon using CSS
            const icon = this.parentElement;
            icon.innerHTML = '<div class="fallback-icon">📋</div>';
            icon.querySelector('.fallback-icon').style.fontSize = '40px';
        });
    });

    // Add error handling for tile images
    document.querySelectorAll('.tile-image img').forEach(img => {
        img.addEventListener('error', function () {
            // Create a fallback gradient background
            const imageContainer = this.parentElement;
            imageContainer.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
            imageContainer.innerHTML = '<div class="fallback-text" style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-weight:bold;">Image Unavailable</div>';
        });

        // Add subtle loading effect
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0';
    });

    // Add hover effects for better user experience
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        tile.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });
    });

    // Initialize tile focus management for accessibility
    tiles.forEach((tile, index) => {
        const link = tile.querySelector('.tile-link');
        link.setAttribute('tabindex', index + 1);

        link.addEventListener('focus', function () {
            tile.classList.add('tile-focused');
        });

        link.addEventListener('blur', function () {
            tile.classList.remove('tile-focused');
        });
    });

    // Dia Chatbot Functionality - Site-specific information only
    const chatbotData = {
        greetings: [
            "Hello! I'm Dia, your diabetes assistant. I can help with information available on our Diabetes Compass website. What would you like to know?",
            "Hi there! I'm here to help you with diabetes information from our website. How can I assist you today?",
            "Welcome! I'm Dia, ready to help you navigate our diabetes resources. What can I help you with?"
        ],
        siteContent: {
            // Information about the website itself
            "about us": {
                response: "Diabetes Compass is your comprehensive guide to diabetes care and management. Our website provides information, resources, and support to help you navigate your diabetes journey with tiles covering nutrition, latest treatments, finding doctors, physical activities, and more.",
                followUp: ["What specific area interests you?", "Want to explore our physical activities?", "Need information about our BMI calculator?"]
            },
            "physical activities": {
                response: "Our Physical Activities section includes diabetes-friendly exercises like Yoga (improves flexibility and blood sugar control), Running (great cardio for diabetes), Cycling (low-impact exercise), Group Activities (social support), Hiking (outdoor fitness), and Swimming (full-body workout). All activities are designed for people with diabetes.",
                followUp: ["Want specific exercise tips?", "Need information about blood sugar during exercise?", "Interested in group activities?"]
            },
            "bmi calculator": {
                response: "Our website features an interactive BMI calculator to help you track your health metrics. BMI is important for diabetes management as maintaining a healthy weight can improve blood sugar control and reduce complications.",
                followUp: ["Want tips for healthy weight management?", "Need diet information?", "Interested in exercise for weight control?"]
            },
            "navigation": {
                response: "You can navigate our site using the menu which includes: Contact Us (get in touch with our team), Contribute (share your diabetes journey), Need a doctor? (find healthcare providers), and access to all our main sections through the tile interface.",
                followUp: ["Need contact information?", "Want to contribute your story?", "Looking for a doctor?"]
            },
            "tiles": {
                response: "Our homepage features informative tiles covering: About Us, Nutrition, Latest Treatments, Find the Best Doctors, Physical Activities, Events, and Check Your BMI. Each tile provides specialized diabetes information and resources.",
                followUp: ["Which tile interests you most?", "Want nutrition information?", "Need latest treatment info?"]
            },
            // Basic diabetes information that would be on the site
            "diabetes basics": {
                response: "Based on our website content: Diabetes is a condition affecting blood sugar levels. Our site covers Type 1 (autoimmune) and Type 2 (lifestyle-related) diabetes, with resources for management, nutrition, exercise, and finding healthcare providers.",
                followUp: ["Want to explore our nutrition section?", "Need exercise information?", "Looking for doctors?"]
            },
            "nutrition": {
                response: "Our nutrition section emphasizes diabetes-friendly eating: choosing whole grains, including vegetables, lean proteins, and healthy fats. We promote the plate method and provide guidance on portion control and meal planning for blood sugar management.",
                followUp: ["Want meal planning tips?", "Need portion control guidance?", "Interested in our BMI calculator?"]
            }
        },
        websiteFeatures: [
            "I can help you navigate our Diabetes Compass website",
            "I can explain our physical activities section",
            "I can guide you to our BMI calculator",
            "I can tell you about our navigation menu",
            "I can describe our homepage tiles",
            "I can share basic diabetes information from our site"
        ],
        chatgptOffer: "I don't have that specific information on our Diabetes Compass website. Do you want me to ask ChatGPT for a more detailed answer about your question?",
        fallbacks: [
            "I'm designed to help with information available on our Diabetes Compass website. Do you want me to ask ChatGPT for information beyond our site content?",
            "That question is outside my knowledge of our website content. Would you like me to ask ChatGPT for a more comprehensive answer?",
            "I can only provide information from our Diabetes Compass site. Should I ask ChatGPT to help with your question?"
        ]
    };

    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    let conversationContext = [];

    // Toggle chatbot
    function toggleChatbot() {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    }

    // Add message to chat
    function addMessage(content, isUser = false, hasFollowUp = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        messageDiv.innerHTML = `
            <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="message-content">
                <p>${content}</p>
                ${hasFollowUp ? '<div class="quick-actions" id="follow-up-actions"></div>' : ''}
            </div>
        `;

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        return messageDiv;
    }

    // Add follow-up buttons
    function addFollowUpButtons(followUpQuestions) {
        const followUpContainer = document.getElementById('follow-up-actions');
        if (followUpContainer) {
            followUpQuestions.forEach(question => {
                const button = document.createElement('button');
                button.className = 'quick-btn';
                button.textContent = question;
                button.onclick = () => handleQuickAction(question);
                followUpContainer.appendChild(button);
            });
        }
    }

    // Show typing indicator
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingDiv;
    }

    // Process user message - Site content only
    function processMessage(userMessage) {
        const message = userMessage.toLowerCase();

        // Add to conversation context
        conversationContext.push(message);

        // Keep only last 5 messages for context
        if (conversationContext.length > 5) {
            conversationContext.shift();
        }

        // Find best response from site content only
        let response = null;
        let followUp = [];
        let foundMatch = false;

        // Check for exact matches in site content
        for (const [key, data] of Object.entries(chatbotData.siteContent)) {
            if (message.includes(key.toLowerCase()) ||
                key.toLowerCase().includes(message) ||
                message.includes(key.replace(/\s+/g, ''))) {
                response = data.response;
                followUp = data.followUp;
                foundMatch = true;
                break;
            }
        }

        // Check for site-specific keyword matches
        if (!foundMatch) {
            const siteKeywords = {
                'hello|hi|hey|good morning|good evening': () => {
                    foundMatch = true;
                    return chatbotData.greetings[Math.floor(Math.random() * chatbotData.greetings.length)];
                },
                'help|support|assist': () => {
                    foundMatch = true;
                    return "I can help you navigate our Diabetes Compass website! I know about our physical activities, BMI calculator, navigation menu, and diabetes resources available on the site.";
                },
                'what can you do|what do you know|capabilities': () => {
                    foundMatch = true;
                    return "I can help with information from our Diabetes Compass website: " + chatbotData.websiteFeatures.join(", ") + ".";
                },
                'thank|thanks|appreciate': () => {
                    foundMatch = true;
                    return "You're welcome! I'm here to help you navigate our Diabetes Compass website. 😊";
                },
                'bye|goodbye|see you': () => {
                    foundMatch = true;
                    return "Goodbye! Feel free to explore more of our Diabetes Compass website. Take care! 👋";
                },
                'yoga|running|cycling|hiking|swimming|group activities': () => {
                    foundMatch = true;
                    return chatbotData.siteContent["physical activities"].response;
                },
                'bmi|body mass index|weight|calculate': () => {
                    foundMatch = true;
                    return chatbotData.siteContent["bmi calculator"].response;
                },
                'menu|navigation|navigate|contact|contribute|doctor': () => {
                    foundMatch = true;
                    return chatbotData.siteContent.navigation.response;
                },
                'tile|tiles|homepage|main page': () => {
                    foundMatch = true;
                    return chatbotData.siteContent.tiles.response;
                },
                'nutrition|diet|food|eating': () => {
                    foundMatch = true;
                    return chatbotData.siteContent.nutrition.response;
                },
                'diabetes|blood sugar|glucose': () => {
                    foundMatch = true;
                    return chatbotData.siteContent["diabetes basics"].response;
                }
            };

            for (const [pattern, responseFunc] of Object.entries(siteKeywords)) {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(message)) {
                    response = responseFunc();
                    followUp = ["Explore our physical activities", "Check our BMI calculator", "Learn about our site navigation"];
                    break;
                }
            }
        }

        // If no site-specific content matches, offer ChatGPT
        if (!foundMatch || !response) {
            response = chatbotData.chatgptOffer;
            followUp = ["Yes, ask ChatGPT", "No, help with website info", "Show me what you know"];
        }

        return { response, followUp };
    }

    // Handle quick action buttons
    function handleQuickAction(message) {
        addMessage(message, true);

        // Special handling for ChatGPT requests
        if (message.toLowerCase().includes('yes, ask chatgpt')) {
            handleChatGPTRequest();
        } else if (message.toLowerCase().includes('no, help with website info')) {
            const helpMessage = "I can help you with our Diabetes Compass website features: " + chatbotData.websiteFeatures.join(", ") + ". What would you like to know about?";
            addMessage(helpMessage, false, true);
            setTimeout(() => addFollowUpButtons(["Physical activities", "BMI calculator", "About us", "Navigation help"]), 100);
        } else if (message.toLowerCase().includes('show me what you know')) {
            const knowledgeMessage = "Here's what I know about our Diabetes Compass website:\n\n• Physical Activities (Yoga, Running, Cycling, Group Activities, Hiking, Swimming)\n• BMI Calculator for health tracking\n• Navigation menu (Contact Us, Contribute, Need a doctor?)\n• Homepage tiles with diabetes resources\n• Basic diabetes information relevant to our site";
            addMessage(knowledgeMessage, false, true);
            setTimeout(() => addFollowUpButtons(["Tell me about physical activities", "Explain navigation", "About diabetes basics"]), 100);
        } else {
            handleUserMessage(message);
        }
    }

    // Handle ChatGPT request simulation
    function handleChatGPTRequest() {
        const typingIndicator = showTyping();

        setTimeout(() => {
            typingIndicator.remove();
            const chatgptMessage = "I would love to ask ChatGPT for you, but I'm currently designed to work only with our Diabetes Compass website content. For questions beyond our site, I recommend:\n\n• Visiting chat.openai.com directly\n• Consulting with healthcare professionals\n• Checking reputable medical websites\n\nIs there anything about our Diabetes Compass website I can help you with instead?";

            addMessage(chatgptMessage, false, true);
            setTimeout(() => addFollowUpButtons(["Show me website features", "Physical activities info", "BMI calculator help"]), 100);
        }, 1500);
    }

    // Handle user message
    function handleUserMessage(userMessage) {
        // Check for ChatGPT response first
        if (userMessage.toLowerCase().includes('yes, ask chatgpt') ||
            userMessage.toLowerCase().includes('ask chatgpt')) {
            handleChatGPTRequest();
            return;
        }

        const typingIndicator = showTyping();

        setTimeout(() => {
            typingIndicator.remove();
            const { response, followUp } = processMessage(userMessage);
            const botMessage = addMessage(response, false, followUp.length > 0);

            if (followUp.length > 0) {
                setTimeout(() => addFollowUpButtons(followUp), 100);
            }
        }, Math.random() * 1000 + 500); // Random delay to simulate thinking
    }

    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatbotInput.value = '';
            handleUserMessage(message);
        }
    }

    // Event listeners
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', toggleChatbot);
    }

    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Handle initial quick action buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-btn')) {
            const message = e.target.getAttribute('data-message');
            if (message) {
                addMessage(message, true);
                handleUserMessage(message);
            }
        }
    });

});