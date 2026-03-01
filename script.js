// Diabetes Compass - Interactive Home Page with Contextual Banner
document.addEventListener('DOMContentLoaded', function () {
    // Fallback: Ensure login button exists if navbar-login.html is missing
    setTimeout(() => {
        if (!document.getElementById('show-login-btn')) {
            const btn = document.createElement('button');
            btn.className = 'login-btn-topright';
            btn.id = 'show-login-btn';
            btn.textContent = 'Login';
            btn.style.position = 'absolute';
            btn.style.top = '18px';
            btn.style.right = '32px';
            btn.style.zIndex = '2000';
            document.body.appendChild(btn);
        }
    }, 500);

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

    // Enhanced Login/Register console
    const loginBtn = document.getElementById('show-login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            let username = '';
            let email = '';
            let action = '';
            // Step 1: Ask for username
            username = prompt('Login\n\nEnter your username:');
            if (username === null) return;
            // Step 2: Ask for email
            email = prompt('Login\n\nEnter your email:');
            if (email === null) return;
            // Step 3: Ask for action
            action = prompt('Type "1" to Login or "2" to Register:');
            if (action === null) return;
            if (action === '1') {
                // Login flow: ask for password
                const password = prompt('Login\n\nEnter your password:');
                if (password === null) return;
                // Try login with Supabase
                try {
                    const { supabase } = await import('./supabaseClient.js');
                    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) {
                        alert('Login failed: ' + error.message);
                    } else {
                        alert('Login successful!');
                        window.location.reload();
                    }
                } catch (err) {
                    alert('Login error: ' + err.message);
                }
            } else if (action === '2') {
                // Register flow: ask for registration fields
                const regEmail = prompt('Register\n\nEnter your email:');
                if (regEmail === null) return;
                const regPassword = prompt('Register\n\nEnter your password:');
                if (regPassword === null) return;
                const regName = prompt('Register\n\nEnter your name:');
                if (regName === null) return;
                const regDiabetesType = prompt('Register\n\nEnter diabetes type (Type 1, Type 2, Gestational, Other):');
                if (regDiabetesType === null) return;
                const regGlucoseUnit = prompt('Register\n\nEnter glucose unit (mmol/L or mg/dL):');
                if (regGlucoseUnit === null) return;
                const regInsulinUser = prompt('Register\n\nAre you an insulin user? (Yes/No):');
                if (regInsulinUser === null) return;
                // Register with Supabase
                try {
                    const { supabase } = await import('./supabaseClient.js');
                    const { data, error } = await supabase.auth.signUp({
                        email: regEmail,
                        password: regPassword,
                        options: { data: { name: regName } }
                    });
                    if (error) {
                        alert('Registration failed: ' + error.message);
                        return;
                    }
                    // Save profile fields
                    const user = data.user || (supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null);
                    if (user) {
                        const { error: profileErrorUpsert } = await supabase.from('profiles').upsert({
                            user_id: user.id,
                            name: regName,
                            diabetes_type: regDiabetesType,
                            glucose_unit: regGlucoseUnit,
                            insulin_user: regInsulinUser
                        });
                        if (profileErrorUpsert) {
                            alert('Profile save failed: ' + profileErrorUpsert.message);
                            return;
                        }
                    }
                    alert('Registration successful! Please check your email to confirm your account.');
                    window.location.reload();
                } catch (err) {
                    alert('Registration error: ' + err.message);
                }
            } else {
                alert('Invalid action. Please try again.');
            }
        });
    }
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

// Use a function to ensure we get the elements even if they're not ready immediately
const getBannerElements = () => ({
    factElement: document.getElementById('diabetes-fact'),
    prevBtn: document.getElementById('prev-fact'),
    nextBtn: document.getElementById('next-fact'),
    indicators: document.querySelectorAll('.indicator')
});

function updateFact(index) {
    const { factElement, indicators } = getBannerElements();

    if (factElement && diabetesFacts && diabetesFacts[index]) {
        currentFactIndex = index;

        // Immediate text change if it's currently showing loading
        if (factElement.textContent.includes("Loading")) {
            factElement.textContent = "DID YOU KNOW? " + diabetesFacts[currentFactIndex];
            factElement.style.opacity = '1';
            factElement.style.transform = 'translateX(0)';
            return;
        }

        // Enhanced slide-out animation for subsequent transitions
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
        if (indicators && indicators.length > 0) {
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
const { factElement, nextBtn, prevBtn, indicators } = getBannerElements();

if (factElement) {
    // Immediate content load to fix banner showing "Loading..."
    const firstFact = diabetesFacts && diabetesFacts.length > 0 ? diabetesFacts[0] :
        "Diabetes affects over 422 million people worldwide, but with proper management, people with diabetes can live healthy, fulfilling lives.";

    factElement.textContent = "DID YOU KNOW? " + firstFact;
    factElement.style.opacity = '1';
    factElement.style.transform = 'translateX(0)';

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
    if (indicators) {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoRotation();
                updateFact(index);
                startAutoRotation();
            });
        });
    }

    // Pause auto-rotation on hover
    const banner = document.querySelector('.did-you-know-banner');
    if (banner) {
        banner.addEventListener('mouseenter', stopAutoRotation);
        banner.addEventListener('mouseleave', startAutoRotation);
    }
} else {
    // Fallback if factElement is not found during initial check
    const retryBanner = setInterval(() => {
        const retryElement = document.getElementById('diabetes-fact');
        if (retryElement) {
            const firstFactFallback = diabetesFacts && diabetesFacts.length > 0 ? diabetesFacts[0] :
                "Diabetes affects over 422 million people worldwide, but with proper management, people with diabetes can live healthy, fulfilling lives.";
            retryElement.textContent = "DID YOU KNOW? " + firstFactFallback;
            retryElement.style.opacity = '1';
            retryElement.style.transform = 'translateX(0)';
            clearInterval(retryBanner);
        }
    }, 100);

    // Stop retrying after 5 seconds
    setTimeout(() => clearInterval(retryBanner), 5000);
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
            response: "Our navigation menu includes: Contact Us (email support), Share Your Story (contribute your diabetes journey), and Need a doctor? (find healthcare providers). You can access these from the top menu bar on any page.",
            followUp: ["Need to contact us?", "Want to share your story?", "Looking for a doctor?"]
        },
        "tiles": {
            response: "Our homepage features tiles covering key diabetes topics: Nutrition & Diet, Latest Treatments, Find a Doctor, Physical Activities, Events & Support, and About Us. Click any tile to explore that topic in detail.",
            followUp: ["Interested in nutrition?", "Want to see physical activities?", "Need doctor information?"]
        },
        "nutrition": {
            response: "Proper nutrition is essential for diabetes management. Our Nutrition page includes a comprehensive Glycemic Index (GI) guide showing which foods affect blood sugar and how. Visit the Nutrition section to learn about low, medium, and high GI foods, plus tips for managing glycemic impact.",
            followUp: ["What is Glycemic Index?", "Show me low GI foods", "Need meal planning tips?"]
        },
        "treatments": {
            response: "Our Latest Treatments page covers modern diabetes therapies including insulin options (ultra-rapid, long-acting, weekly), oral medications (SGLT2 inhibitors, GLP-1 agonists), injectable non-insulin medications like Semaglutide and Tirzepatide, plus emerging therapies like stem cells and gene therapy. We also feature diabetes technology including CGMs, smart pumps, and AI-powered management.",
            followUp: ["Tell me about insulin types", "What is Semaglutide?", "Explain CGM technology"]
        },
        "diabetes basics": {
            response: "Diabetes is a condition affecting how your body processes blood sugar. Our website provides information on Type 1, Type 2, and gestational diabetes, along with management tips, lifestyle guidance, and resources for living well with diabetes.",
            followUp: ["Want to learn about Type 1?", "Interested in Type 2 information?", "Need management tips?"]
        },
        // FAQ Content
        "glycemic index": {
            response: "The Glycemic Index (GI) is a ranking system for carbohydrates based on how quickly they raise blood sugar levels. Foods are categorized as: Low GI (0-55) for slow digestion and gradual blood sugar rise (e.g., lentils, apples, Greek yogurt), Medium GI (56-69) for moderate impact (e.g., brown rice, oatmeal), and High GI (70+) for rapid blood sugar spike (e.g., white bread, white rice). Choose low GI foods most often to maintain stable blood sugar levels.",
            followUp: ["Show me low GI foods", "What foods should I avoid?", "Tell me about insulin response"]
        },
        "low gi foods": {
            response: "Excellent low GI food choices include: Proteins like eggs (GI: 0), Greek yogurt (GI: 11), and peanuts (GI: 14). Vegetables like lettuce and spinach (GI: 15). Legumes like chickpeas (GI: 28) and lentils (GI: 32). Fruits like apples (GI: 36). Visit our Nutrition page for a complete GI chart you can download!",
            followUp: ["What about medium GI foods?", "Foods to avoid?", "Export GI chart"]
        },
        "foods to avoid": {
            response: "Foods to limit with diabetes include high GI options that cause rapid blood sugar spikes: White bread (GI: 75), White rice (GI: 73), Baked potatoes (GI: 85), Cornflakes (GI: 81), and sugary drinks. You don't have to eliminate them entirely—just consume in moderation and pair with protein or fiber to slow absorption.",
            followUp: ["What can I eat instead?", "Tell me about low GI foods", "Nutrition tips"]
        },
        "insulin response": {
            response: "Insulin response measures how much insulin your body needs to process a food. High GI foods typically trigger a high insulin response, which can cause energy crashes, increase hunger shortly after eating, and make blood sugar management more difficult. Choosing foods with lower insulin responses helps maintain steady energy and better diabetes control.",
            followUp: ["What is glycemic index?", "Low GI foods", "Nutrition page"]
        },
        "best exercise for diabetes": {
            response: "The best exercises for diabetes include: Yoga (reduces stress, improves blood sugar), Swimming (low-impact, joint-friendly), Cycling (great aerobic exercise), Running/Walking (cardiovascular health), Hiking (combines exercise with nature), and Group Activities like Zumba and Tai Chi. Aim for 150 minutes of aerobic exercise per week plus 2-3 strength training sessions.",
            followUp: ["Tell me about yoga", "Swimming benefits", "Exercise safety tips"]
        },
        "swimming diabetes": {
            response: "Swimming is excellent for diabetes management because: It's low-impact and gentle on joints, water supports your body reducing injury risk, great for those with neuropathy or foot issues, improves cardiovascular health, burns calories effectively, and it's a cooling exercise great for hot weather.",
            followUp: ["Other exercises?", "Exercise safety", "Group activities"]
        },
        "yoga diabetes": {
            response: "Yoga offers multiple benefits for diabetes: Stress reduction (lower cortisol helps regulate blood sugar), improved flexibility with gentle movements, better sleep which improves insulin sensitivity, and increased body awareness. Visit our Yoga page for beginner-friendly video tutorials!",
            followUp: ["Other exercises?", "Exercise safety", "Swimming benefits"]
        },
        "exercise safety": {
            response: "Important safety tips for exercising with diabetes: Check blood sugar before, during, and after exercise. Don't exercise if blood sugar is above 250 mg/dL with ketones or below 100 mg/dL. Always carry fast-acting glucose (tablets or juice). Stay hydrated. Wear proper footwear and check feet after exercise. Wear a medical ID bracelet. Stop immediately if you feel dizzy, confused, or have chest pain.",
            followUp: ["Best exercises?", "How often should I exercise?", "Physical activities page"]
        },
        "how often exercise": {
            response: "General exercise recommendations for diabetes: Aerobic exercise at least 150 minutes per week (30 minutes, 5 days), Strength training 2-3 sessions per week, and daily stretching or yoga for flexibility. Start slowly and gradually increase intensity. Even a 10-minute walk after meals can significantly improve blood sugar control!",
            followUp: ["Exercise safety tips", "Best exercises?", "Yoga benefits"]
        },
        "bmi": {
            response: "Our BMI Calculator helps you calculate your Body Mass Index, estimate daily calorie needs, get personalized diet recommendations, and email your results. Simply enter your height, weight, age, and activity level to get instant results. The email feature is available for registered users.",
            followUp: ["How is BMI calculated?", "What's a healthy BMI?", "Create an account"]
        },
        "export gi chart": {
            response: "Yes! On our Nutrition page, you can click the 'Export to Excel' button to download a formatted spreadsheet containing the complete list of foods with GI values, GI category classification (Low/Medium/High), insulin response information, and color-coded formatting for easy reference.",
            followUp: ["What is glycemic index?", "Low GI foods", "Visit nutrition page"]
        },
        "create account": {
            response: "Creating an account is free and optional. Benefits include: Save your BMI calculations and diet plans, email personalized reports, track your progress over time, and share your diabetes story. Click the Login/Register button in the navigation to get started!",
            followUp: ["BMI calculator", "Share your story", "Site features"]
        },
        "cgm|continuous glucose monitor": {
            response: "A Continuous Glucose Monitor (CGM) is a device that continuously tracks your glucose levels throughout the day and night. Benefits include: No more finger pricks for routine monitoring, real-time readings on your phone or receiver, alerts for high and low blood sugar, trend data to see how food and activity affect you, and ability to share data with your healthcare team.",
            followUp: ["Other treatments?", "Latest treatments page", "Diabetes technology"]
        },
        "faq|frequently asked questions": {
            response: "Our FAQ page covers questions about: General diabetes information, Nutrition & Diet (glycemic index, foods to eat/avoid), Physical Activities & Exercise, Treatments & Medications, and our website Tools & Features. Visit the FAQ page for detailed answers with search and category filters!",
            followUp: ["Nutrition questions", "Exercise questions", "Treatment questions"]
        }
    },
    websiteFeatures: [
        "navigate our Diabetes Compass website",
        "physical activities section",
        "BMI calculator",
        "navigation menu",
        "homepage tiles",
        "basic diabetes information",
        "FAQ section with searchable answers"
    ],
    chatgptOffer: "Unfortunately, I cannot answer your question but my friend <a href='https://chat.openai.com/' target='_blank' style='color: #667eea; font-weight: bold;'>Chat</a> will probably help you! Click on 'Chat' to open ChatGPT in a new tab.",
    fallbacks: [
        "Unfortunately, I cannot answer your question but my friend <a href='https://chat.openai.com/' target='_blank' style='color: #667eea; font-weight: bold;'>Chat</a> will probably help you!",
        "I don't have that information, but my friend <a href='https://chat.openai.com/' target='_blank' style='color: #667eea; font-weight: bold;'>Chat</a> will probably help you!",
        "That's outside my knowledge, but <a href='https://chat.openai.com/' target='_blank' style='color: #667eea; font-weight: bold;'>Chat</a> can help you with that!"
    ]
};

const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

let conversationContext = [];
let lastUnansweredQuestion = '';

// Toggle chatbot visibility
function toggleChatbot() {
    if (chatbotContainer) {
        chatbotContainer.classList.toggle('active');
        const isOpen = chatbotContainer.classList.contains('active');
        if (isOpen && chatbotInput) {
            chatbotInput.focus();
        }
        console.log('Chatbot toggled:', isOpen ? 'opened' : 'closed');
    } else {
        console.error('Chatbot container not found!');
    }
}

function createDiaAvatar(state = 'idle') {
    const emoji = state === 'thinking' ? '🤔' : '😊';
    return '<div class="dia-avatar-container" style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid #667eea;background:#fff;display:flex;align-items:center;justify-content:center;">' +
        '<img src="images/dia-avatar.jpg" alt="Dia" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';">' +
        '<span style="display:none;font-size:20px;">' + emoji + '</span>' +
        '</div>';
}

function addMessage(content, isUser = false, hasFollowUp = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';

    const avatarHtml = isUser ? '<div class="message-avatar">👤</div>' :
        '<div class="message-avatar">' + createDiaAvatar('speaking') + '</div>';

    let html = avatarHtml;
    html += '<div class="message-content"><p>' + content + '</p>';
    if (hasFollowUp) {
        html += '<div class="quick-actions" id="follow-up-actions"></div>';
    }
    html += '</div>';

    messageDiv.innerHTML = html;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return messageDiv;
}

function addFollowUpButtons(followUpQuestions) {
    const followUpContainer = document.getElementById('follow-up-actions');
    if (followUpContainer) {
        followUpContainer.innerHTML = '';
        followUpQuestions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'quick-btn';
            button.textContent = question;
            button.onclick = () => {
                addMessage(question, true);
                handleUserMessage(question);
            };
            followUpContainer.appendChild(button);
        });
    }
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = '<div class="message-avatar">🤔</div><div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typingDiv;
}

function handleUserMessage(userMessage) {
    const message = userMessage.toLowerCase();
    const typing = showTyping();

    setTimeout(() => {
        typing.remove();
        let response = chatbotData.chatgptOffer;
        let followUp = ["Yes, ask ChatGPT", "No, help with website info"];

        for (const [key, data] of Object.entries(chatbotData.siteContent)) {
            if (message.includes(key)) {
                response = data.response;
                followUp = data.followUp;
                break;
            }
        }

        addMessage(response, false, followUp.length > 0);
        if (followUp.length > 0) {
            addFollowUpButtons(followUp);
        }
    }, 1000);
}

if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
    });
}

if (chatbotSend) {
    chatbotSend.addEventListener('click', () => {
        const text = chatbotInput.value.trim();
        if (text) {
            addMessage(text, true);
            chatbotInput.value = '';
            handleUserMessage(text);
        }
    });
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') chatbotSend.click();
    });
}


// Add message to chat with dynamic avatar state
function addMessage(content, isUser = false, hasFollowUp = false, avatarState = 'speaking') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    // Determine appropriate avatar state based on content
    if (!isUser && !avatarState) {
        if (content.includes('🚀') || content.includes('✅')) {
            avatarState = 'excited';
        } else if (content.includes('?') && content.includes('ChatGPT')) {
            avatarState = 'thinking';
        } else {
            avatarState = 'speaking';
        }
    }

    messageDiv.innerHTML = `
            <div class="message-avatar">${isUser ? '👤' : createDiaAvatar(avatarState)}</div>
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
        followUpContainer.innerHTML = ''; // Clear previous actions
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
            <div class="message-avatar">${createDiaAvatar('thinking')}</div>
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
    let avatarState = 'speaking';

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
                return {
                    text: chatbotData.greetings[Math.floor(Math.random() * chatbotData.greetings.length)],
                    avatarState: 'excited'
                };
            },
            'help|support|assist': () => {
                foundMatch = true;
                return {
                    text: "I can help you navigate our Diabetes Compass website! I know about our physical activities, BMI calculator, navigation menu, and diabetes resources available on the site.",
                    avatarState: 'idle'
                };
            },
            'what can you do|what do you know|capabilities': () => {
                foundMatch = true;
                return {
                    text: "I can help with information from our Diabetes Compass website: " + chatbotData.websiteFeatures.join(", ") + ".",
                    avatarState: 'speaking'
                };
            },
            'thank|thanks|appreciate': () => {
                foundMatch = true;
                return {
                    text: "You're welcome! I'm here to help you navigate our Diabetes Compass website. 😊",
                    avatarState: 'excited'
                };
            },
            'bye|goodbye|see you': () => {
                foundMatch = true;
                return {
                    text: "Goodbye! Feel free to explore more of our Diabetes Compass website. Take care! 👋",
                    avatarState: 'excited'
                };
            },
            'yoga|running|cycling|hiking|swimming|group activities': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["physical activities"].response,
                    avatarState: 'excited'
                };
            },
            'bmi|body mass index|weight|calculate': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["bmi"].response,
                    avatarState: 'speaking'
                };
            },
            'menu|navigation|navigate|contact|share your story|share story|doctor': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent.navigation.response,
                    avatarState: 'speaking'
                };
            },
            'tile|tiles|homepage|main page': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent.tiles.response,
                    avatarState: 'speaking'
                };
            },
            'nutrition|diet|food|eating': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent.nutrition.response,
                    avatarState: 'speaking'
                };
            },
            'diabetes|blood sugar|glucose': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["diabetes basics"].response,
                    avatarState: 'speaking'
                };
            },
            // FAQ-related keywords
            'glycemic index|gi value|gi foods': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["glycemic index"].response,
                    avatarState: 'speaking'
                };
            },
            'low gi|low glycemic': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["low gi foods"].response,
                    avatarState: 'speaking'
                };
            },
            'avoid|shouldn\'t eat|bad foods|high gi': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["foods to avoid"].response,
                    avatarState: 'speaking'
                };
            },
            'insulin response|insulin level': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["insulin response"].response,
                    avatarState: 'speaking'
                };
            },
            'best exercise|exercise for diabetes|workout': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["best exercise for diabetes"].response,
                    avatarState: 'excited'
                };
            },
            'exercise safety|safe exercise|precaution': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["exercise safety"].response,
                    avatarState: 'speaking'
                };
            },
            'how often|exercise frequency|how much exercise': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["how often exercise"].response,
                    avatarState: 'speaking'
                };
            },
            'cgm|continuous glucose|glucose monitor': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["cgm|continuous glucose monitor"].response,
                    avatarState: 'speaking'
                };
            },
            'faq|frequently asked|questions': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["faq|frequently asked questions"].response,
                    avatarState: 'speaking'
                };
            },
            'export|download|excel': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["export gi chart"].response,
                    avatarState: 'speaking'
                };
            },
            'account|register|sign up': () => {
                foundMatch = true;
                return {
                    text: chatbotData.siteContent["create account"].response,
                    avatarState: 'speaking'
                };
            }
        };

        for (const [pattern, responseFunc] of Object.entries(siteKeywords)) {
            const regex = new RegExp(pattern, 'i');
            if (regex.test(message)) {
                const result = responseFunc();
                if (typeof result === 'string') {
                    response = result;
                } else {
                    response = result.text;
                    avatarState = result.avatarState;
                }
                followUp = ["Explore our FAQ", "Check our BMI calculator", "Learn about nutrition"];
                break;
            }
        }
    }

    // If no site-specific content matches, offer Chat (ChatGPT) as friend
    if (!foundMatch || !response) {
        lastUnansweredQuestion = userMessage; // Store for ChatGPT redirect
        response = chatbotData.chatgptOffer;
        avatarState = 'thinking';
        followUp = ["Visit FAQ page", "Show me website features", "Tell me about nutrition"];
    }

    return { response, followUp, avatarState };
}

// Handle quick action buttons
function handleQuickAction(message) {
    addMessage(message, true);

    // Handle FAQ page visit
    if (message.toLowerCase().includes('visit faq') || message.toLowerCase().includes('explore our faq')) {
        window.location.href = 'faq.html';
        return;
    } else if (message.toLowerCase().includes('yes, ask chatgpt')) {
        handleChatGPTRequest();
    } else if (message.toLowerCase().includes('copy question again')) {
        const success = copyToClipboardWithFeedback(lastUnansweredQuestion);
        const copyMessage = success ?
            `Question copied again: "${lastUnansweredQuestion}"\n\nYou can now paste it(Ctrl + V) into ChatGPT!` :
            `Please copy this question manually: \n\n"${lastUnansweredQuestion}"\n\nSelect the text above and use Ctrl + C to copy.`;

        addMessage(copyMessage, false, true);
        setTimeout(() => addFollowUpButtons(["Open ChatGPT", "Show me website features", "Physical activities info"]), 100);
    } else if (message.toLowerCase().includes('open chatgpt')) {
        window.open('https://chat.openai.com/', '_blank');
        addMessage("ChatGPT opened in new tab! Don't forget to paste your question.", false);
    } else if (message.toLowerCase().includes('no, help with website info')) {
        const helpMessage = "I can help you with our Diabetes Compass website features: " + chatbotData.websiteFeatures.join(", ") + ". What would you like to know about?";
        addMessage(helpMessage, false, true);
        setTimeout(() => addFollowUpButtons(["Physical activities", "BMI calculator", "About us", "Navigation help"]), 100);
    } else if (message.toLowerCase().includes('show me what you know')) {
        const knowledgeMessage = "Here's what I know about our Diabetes Compass website:\n\n• Physical Activities (Yoga, Running, Cycling, Group Activities, Hiking, Swimming)\n• BMI Calculator for health tracking\n• Navigation menu (Contact Us, Share Your Story, Need a doctor?)\n• Homepage tiles with diabetes resources\n• Basic diabetes information relevant to our site";
        addMessage(knowledgeMessage, false, true);
        setTimeout(() => addFollowUpButtons(["Tell me about physical activities", "Explain navigation", "About diabetes basics"]), 100);
    } else {
        handleUserMessage(message);
    }
}

// Handle ChatGPT request - redirect with question
function handleChatGPTRequest() {
    const typingIndicator = showTyping();

    // Create a popup window with the question for easy copy
    const questionPopup = createQuestionPopup(lastUnansweredQuestion);

    setTimeout(() => {
        typingIndicator.remove();

        // Copy the question to clipboard with user feedback
        copyToClipboardWithFeedback(lastUnansweredQuestion);

        // Open ChatGPT in new tab with delay to ensure popup is visible
        setTimeout(() => {
            window.open('https://chat.openai.com/', '_blank');
        }, 500);

        const chatgptMessage = `Opening ChatGPT in a new tab...\n\nYour question: "${lastUnansweredQuestion}"\n\nQuestion copied to clipboard! Just paste (Ctrl + V) when ChatGPT loads.\n\nFeel free to ask me about our Diabetes Compass website when you return!`;

        addMessage(chatgptMessage, false, true);
        setTimeout(() => addFollowUpButtons(["Copy question again", "Show me website features", "Physical activities info"]), 100);
    }, 1000);
}

// Create popup window with the question
function createQuestionPopup(question) {
    const popup = window.open('', 'questionPopup', 'width=400,height=300,top=100,left=100,scrollbars=yes,resizable=yes');

    if (popup) {
        popup.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Your Question for ChatGPT</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin: 0; }
        .container { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px); }
        h2 { margin-top: 0; text-align: center; }
        .question-box { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 15px 0; word-wrap: break-word; border: 1px solid rgba(255,255,255,0.3); }
        .copy-btn { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; margin: 10px 5px; transition: background 0.3s ease; }
        .copy-btn:hover { background: #45a049; }
        .instructions { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; }
        .close-btn { background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; float: right; }
    </style>
</head>
<body>
    <div class="container">
        <h2>🤖 Question for ChatGPT</h2>
        <div class="question-box" id="questionText">${question}</div>
        <button class="copy-btn" onclick="copyQuestion()">📋 Copy Question</button>
        <button class="copy-btn" onclick="openChatGPT()">🚀 Go to ChatGPT</button>
        <button class="close-btn" onclick="window.close()">✕ Close</button>
        <div class="instructions">
            <strong>Instructions:</strong><br>
            1. Click "Copy Question" or select and copy the text above<br>
            2. Click "Go to ChatGPT" or switch to the ChatGPT tab<br>
            3. Paste your question (Ctrl+V) in the ChatGPT input box<br>
            4. Press Enter to send your question
        </div>
    </div>
    <script>
        function copyQuestion() {
            const questionText = document.getElementById('questionText').textContent;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(questionText).then(function() {
                    alert('✅ Question copied to clipboard!');
                }).catch(function(err) {
                    selectText();
                });
            } else {
                selectText();
            }
        }
        function selectText() {
            const questionElement = document.getElementById('questionText');
            const range = document.createRange();
            range.selectNode(questionElement);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            try {
                document.execCommand('copy');
                alert('✅ Question copied to clipboard!');
            } catch (err) {
                alert('Please manually select and copy the question text.');
            }
        }
        function openChatGPT() {
            window.open('https://chat.openai.com/', '_blank');
        }
    </script>
</body>
</html>`);
        popup.document.close();
    }
    return popup;
}

// Copy text to clipboard helper function with improved feedback
function copyToClipboardWithFeedback(text) {
    let copySuccess = false;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => {
                copySuccess = true;
                console.log('✅ Question copied to clipboard successfully');
            })
            .catch(err => {
                console.log('Modern clipboard failed, trying fallback:', err);
                copySuccess = fallbackCopyToClipboard(text);
            });
    } else {
        copySuccess = fallbackCopyToClipboard(text);
    }

    return copySuccess;
}

// Copy text to clipboard helper function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern clipboard API
        navigator.clipboard.writeText(text).catch(err => {
            console.log('Clipboard write failed:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
    }
}

// Fallback clipboard function
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
        successful = document.execCommand('copy');
        console.log('✅ Fallback clipboard succeeded');
    } catch (err) {
        console.log('❌ Fallback clipboard failed:', err);
    }

    document.body.removeChild(textArea);
    return successful;
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
        const { response, followUp, avatarState } = processMessage(userMessage);
        const botMessage = addMessage(response, false, followUp.length > 0, avatarState || 'speaking');

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

// Initialize Dia avatar styles
addDiaAvatarStyles();

// Initialize Dia avatars in existing HTML elements
function initializeDiaAvatars() {
    console.log('Initializing Dia avatars...');

    // Header avatar
    const headerAvatar = document.getElementById('header-dia-avatar');
    if (headerAvatar) {
        console.log('Found header avatar element');
        headerAvatar.innerHTML = createDiaAvatar('idle');
    } else {
        console.log('Header avatar element not found');
    }

    // Welcome message avatar
    const welcomeAvatar = document.getElementById('welcome-dia-avatar');
    if (welcomeAvatar) {
        console.log('Found welcome avatar element');
        welcomeAvatar.innerHTML = createDiaAvatar('excited');
    } else {
        console.log('Welcome avatar element not found');
    }

    // Toggle button avatar
    const toggleAvatar = document.getElementById('toggle-dia-avatar');
    if (toggleAvatar) {
        console.log('Found toggle avatar element');
        toggleAvatar.innerHTML = createDiaAvatar('idle');
        // Add hover effect to toggle button
        const toggleButton = document.getElementById('chatbot-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('mouseenter', () => {
                toggleAvatar.innerHTML = createDiaAvatar('excited');
            });
            toggleButton.addEventListener('mouseleave', () => {
                toggleAvatar.innerHTML = createDiaAvatar('idle');
            });
        }
    } else {
        console.log('Toggle avatar element not found');
    }

    // Test if image exists
    const testImg = new Image();
    testImg.onload = function () {
        console.log('Avatar image loaded successfully');
    };
    testImg.onerror = function () {
        console.log('Avatar image not found, using emoji fallbacks');
    };
    testImg.src = 'images/dia-avatar.jpg';
}

// Initialize avatars when DOM is ready
setTimeout(() => {
    initializeDiaAvatars();

    // Fallback - if avatars still not visible, force simple emoji display
    setTimeout(() => {
        const elements = ['header-dia-avatar', 'welcome-dia-avatar', 'toggle-dia-avatar'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element && (!element.innerHTML.includes('dia-avatar') || element.innerHTML.trim() === '💬' || element.innerHTML.trim() === '🤖')) {
                console.log(`Forcing simple avatar for ${id}`);
                element.innerHTML = '<div style="font-size: 24px; animation: bounce 2s infinite;">👩‍⚕️</div>';
                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
            }
        });
    }, 500);
}, 100); // Small delay to ensure DOM is fully loaded

// Event listeners
console.log('Setting up chatbot event listeners...');

if (chatbotToggle) {
    console.log('Chatbot toggle button found, adding click listener');
    chatbotToggle.addEventListener('click', function (e) {
        console.log('Chatbot toggle clicked!');
        e.preventDefault();
        toggleChatbot();
    });

    // Test if button is visible and clickable
    console.log('Toggle button position:', chatbotToggle.getBoundingClientRect());
    console.log('Toggle button style:', window.getComputedStyle(chatbotToggle).zIndex);
} else {
    console.error('Chatbot toggle button not found!');
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