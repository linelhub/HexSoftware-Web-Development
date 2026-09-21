// DEV BLOG ADMIN

// CHANGE THIS to the email you use for your admin account
const ADMIN_EMAIL = "guentalinel@gmail.com";


// GET CURRENT LOGGED-IN USER
function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("devBlogCurrentUser")
    ) || null;

}


// CHECK IF CURRENT USER IS ADMIN
function isAdmin() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return false;
    }

    return currentUser.email.toLowerCase() ===
           ADMIN_EMAIL.toLowerCase();

}

// CREATE BLOG POST

const postForm = document.getElementById("postForm");

if (postForm) {

    postForm.addEventListener("submit", function (event) {

        // Stop the page from refreshing
        event.preventDefault();


        // Get current logged-in user
        const currentUser = getCurrentUser();


        // User must be logged in
        if (!currentUser) {

            alert("Please login before publishing an article.");

            window.location.href = "login.html";

            return;
        }


        // Get information from the form
        const title =
            document.getElementById("postTitle").value.trim();

        const category =
            document.getElementById("postCategory").value;

        const content =
            document.getElementById("postContent").value.trim();


        // Create a new post
        const newPost = {

            id: Date.now(),

            title: title,

            category: category,

            content: content,

            date: new Date().toLocaleDateString(),

            // IMPORTANT:
            // This identifies who owns the article
            authorId: currentUser.id,

            authorName: currentUser.name,

            authorEmail: currentUser.email

        };


        // Get existing posts
        const existingPosts =
            JSON.parse(localStorage.getItem("devBlogPosts")) || [];


        // Add new post
        existingPosts.push(newPost);


        // Save posts
        localStorage.setItem(
            "devBlogPosts",
            JSON.stringify(existingPosts)
        );


        // Success message
        alert("Your post has been published successfully!");


        // Clear form
        postForm.reset();


        // Go to blog
        window.location.href = "blog.html";

    });

}

// DELETE BLOG POST

function deletePost(postId) {

    const currentUser = getCurrentUser();

    // Must be logged in
    if (!currentUser) {

        alert("Please login first.");

        return;
    }


    // Get posts
    const posts =
        JSON.parse(localStorage.getItem("devBlogPosts")) || [];


    // Find the post
    const post =
        posts.find(function (item) {

            return String(item.id) === String(postId);

        });


    // Post doesn't exist
    if (!post) {

        alert("Article not found.");

        return;
    }


    // Check ownership
    const ownsPost =
        String(post.authorId) === String(currentUser.id);


    // Allow admin OR owner
    if (!isAdmin() && !ownsPost) {

        alert("You can only delete your own articles.");

        return;
    }


    // Confirm deletion
    const confirmed =
        confirm(
            "Are you sure you want to delete this article?"
        );


    if (!confirmed) {
        return;
    }


    // Remove the post
    const updatedPosts =
        posts.filter(function (item) {

            return String(item.id) !== String(postId);

        });


    // Save updated posts
    localStorage.setItem(
        "devBlogPosts",
        JSON.stringify(updatedPosts)
    );


    alert("Article deleted successfully!");


    // Refresh blog
    window.location.href = "blog.html";

}

// EDIT BLOG POST

function editPost(postId) {

    const currentUser = getCurrentUser();

    // Must be logged in
    if (!currentUser) {

        alert("Please login first.");

        return;
    }


    // Get posts
    const posts =
        JSON.parse(localStorage.getItem("devBlogPosts")) || [];


    // Find the post
    const post =
        posts.find(function (item) {

            return String(item.id) === String(postId);

        });


    // Post doesn't exist
    if (!post) {

        alert("Article not found.");

        return;
    }


    // Check ownership
    const ownsPost =
        String(post.authorId) === String(currentUser.id);


    // Allow admin OR owner
    if (!isAdmin() && !ownsPost) {

        alert("You can only edit your own articles.");

        return;
    }


    // Save the article ID for the edit page
    localStorage.setItem(
        "editingPostId",
        postId
    );


    // Open edit page
    window.location.href = "edit-post.html";

}

function loadEditPost() {

    const postId = localStorage.getItem("editingPostId");

    if (!postId) {
        alert("No article selected.");
        window.location.href = "blog.html";
        return;
    }

    const posts =
        JSON.parse(localStorage.getItem("devBlogPosts")) || [];

    const post =
        posts.find(function (item) {
            return String(item.id) === String(postId);
        });

    if (!post) {
        alert("Article not found.");
        window.location.href = "blog.html";
        return;
    }

    document.getElementById("editTitle").value = post.title;
    document.getElementById("editCategory").value = post.category;
    document.getElementById("editContent").value = post.content;
}
if(document.getElementById("editPostForm")){
    loadEditPost();
}

const editPostForm = document.getElementById("editPostForm");

if (editPostForm) {

    editPostForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const postId =
            localStorage.getItem("editingPostId");

        const posts =
            JSON.parse(localStorage.getItem("devBlogPosts")) || [];


        // Find the article
        const postIndex =
            posts.findIndex(function (item) {

                return String(item.id) === String(postId);

            });


        // Article doesn't exist
        if (postIndex === -1) {

            alert("Article not found.");

            return;
        }


        // Get current user
        const currentUser = getCurrentUser();


        // Must be logged in
        if (!currentUser) {

            alert("Please login first.");

            return;
        }


        // Check ownership
        const ownsPost =
            String(posts[postIndex].authorId) ===
            String(currentUser.id);


        // Allow admin OR owner
        if (!isAdmin() && !ownsPost) {

            alert("You can only edit your own articles.");

            return;
        }


        // Update article
        posts[postIndex].title =
            document.getElementById("editTitle").value.trim();

        posts[postIndex].category =
            document.getElementById("editCategory").value.trim();

        posts[postIndex].content =
            document.getElementById("editContent").value.trim();


        // Save updated posts
        localStorage.setItem(
            "devBlogPosts",
            JSON.stringify(posts)
        );


        // Remove temporary editing ID
        localStorage.removeItem("editingPostId");


        // Success message
        alert("Article updated successfully!");


        // Return to blog
        window.location.href = "blog.html";

    });

}

// DISPLAY SAVED BLOG POSTS

const blogContainer =
    document.getElementById("blogContainer");

if (blogContainer) {

    const savedPosts =
        JSON.parse(localStorage.getItem("devBlogPosts")) || [];


    const postsToDisplay =
        [...savedPosts].reverse();


    postsToDisplay.forEach(function (post) {

        const article =
            document.createElement("article");

        article.className = "blog-card";


        // Category
        const category =
            document.createElement("span");

        category.className = "post-category";

        category.textContent = post.category;


        // Title
        const title =
            document.createElement("h3");

        title.textContent = post.title;


        // Date
        const date =
            document.createElement("p");

        date.className = "blog-date";

        date.textContent =
            "Published: " + post.date;


        // Content preview
        const content =
            document.createElement("p");

        const preview =
            post.content.length > 150
                ? post.content.substring(0, 150) + "..."
                : post.content;

        content.textContent = preview;


        // Read More
        const readMore =
            document.createElement("a");

        readMore.textContent = "Read More →";

        readMore.className = "read-more";

        readMore.href =
            "post.html?id=" + post.id;


        // Add elements to article
article.appendChild(category);
article.appendChild(title);
article.appendChild(date);
article.appendChild(content);
article.appendChild(readMore);

// EDIT AND DELETE BUTTONS

const currentUser = getCurrentUser();

if (currentUser) {

    const ownsPost =
        String(post.authorId) === String(currentUser.id);

    const admin =
        isAdmin();


    // Show buttons to owner OR admin
    if (admin || ownsPost) {

        // Button container
        const postActions =
            document.createElement("div");

        postActions.className =
            "post-actions";


        // EDIT BUTTON
        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Edit Article";

        editButton.className =
            "edit-post-btn";

        editButton.addEventListener(
            "click",
            function () {

                editPost(post.id);

            }
        );


        // DELETE BUTTON
        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete Article";

        deleteButton.className =
            "delete-post-btn";

        deleteButton.addEventListener(
            "click",
            function () {

                deletePost(post.id);

            }
        );


        // Put both buttons inside the container
        postActions.appendChild(editButton);
        postActions.appendChild(deleteButton);


        // Add container to article
        article.appendChild(postActions);

    }

}

        // Add article to blog
        blogContainer.prepend(article);

    });

}

// DISPLAY SINGLE BLOG POST

const singlePost =
    document.querySelector(".single-post");

if (singlePost) {

    // Get ID from URL
    const urlParams =
        new URLSearchParams(window.location.search);

    const postId =
        urlParams.get("id");


    // BUILT-IN DEV BLOG ARTICLES

    const builtInPosts = {

        "cloud-basics": {
    category: "CLOUD COMPUTING",
    title: "Understanding Cloud Computing: A Beginner Guide",
    date: "2026",
    content: `
Cloud computing is the delivery of computing resources such as servers,
storage, databases, networking and software over the internet.

Instead of buying and maintaining all the physical hardware needed to run
an application, individuals and organizations can use resources provided
by cloud platforms.

For example, a business can store files in cloud storage, run a website
on a cloud server and use cloud databases to store application data.

One important concept in cloud computing is scalability.

A system can increase or decrease its computing resources depending on
demand. This can be useful when the number of users changes.

Cloud computing also provides different types of services.

Infrastructure as a Service, or IaaS, provides resources such as virtual
servers, storage and networking.

Platform as a Service, or PaaS, provides an environment that developers
can use to build and deploy applications.

Software as a Service, or SaaS, allows users to access software through
the internet without managing the underlying infrastructure.

Cloud computing is used by businesses, schools, developers, governments
and many other organizations.

However, using the cloud requires responsible management. Users need to
protect their accounts, configure permissions correctly, monitor resources
and understand their costs.

Learning cloud computing can therefore provide a strong foundation for
students interested in technology, software development, networking and
modern IT infrastructure.
`
},

        "student-tech": {
            category: "STUDENTS",
            title: "5 Free Ways Students Can Start Learning Technology",
            date: "2026",
            content: `
Technology is changing the way we learn, work and solve problems. 
The good news is that students do not need expensive equipment to begin 
developing useful technology skills.

1. Start with HTML and CSS

HTML and CSS are great starting points for anyone interested in web 
development. HTML helps you structure webpages while CSS helps you design 
and style them.

You can begin by creating simple pages such as a personal profile, a 
school project website or a small blog.

2. Learn JavaScript

After learning the basics of HTML and CSS, JavaScript can help you make 
websites interactive.

You can build features such as buttons, forms, search systems, calculators 
and simple applications.

3. Explore Cloud Computing

Cloud computing allows people and organizations to use computing resources 
over the internet.

Students can learn about services such as servers, storage, databases and 
networking. These skills are becoming increasingly useful in modern 
technology careers.

4. Build Real Projects

One of the best ways to learn technology is by building things.

Instead of only watching tutorials, try creating projects such as a blog, 
portfolio website, school management system or small business website.

Projects also give you something practical to demonstrate when applying 
for internships or opportunities.

5. Be Consistent

Technology has many areas to explore, so it can take time to become 
comfortable with new concepts.

Spend a little time learning and practicing regularly. Ask questions, 
solve problems and improve your projects as you learn.

You do not need to know everything before starting. The important thing is 
to start, practice and keep improving.
`
        },


        "online-safety": {
            category: "CYBERSECURITY",
            title: "7 Simple Ways to Stay Safe Online",
            date: "2026",
            content: `
The internet provides incredible opportunities for learning, communication 
and business. However, users should also develop good cybersecurity habits.

Here are seven simple ways to protect your accounts and information.

1. Use Strong Passwords

Create passwords that are difficult for other people to guess. Avoid using 
obvious information such as your name or birthday.

2. Enable Multi-Factor Authentication

Multi-factor authentication provides an additional security step when 
logging into an account.

If your password is compromised, another verification step can help protect 
your account.

3. Watch Out for Phishing

Be careful with unexpected emails, messages and websites asking for 
passwords, verification codes or other sensitive information.

Check links and the sender before providing information.

4. Keep Your Software Updated

Operating systems, browsers and applications regularly receive security 
updates. Installing updates helps keep your devices protected.

5. Be Careful on Public Networks

When using public Wi-Fi, avoid entering sensitive information on websites 
that do not use secure connections.

6. Protect Your Personal Information

Think carefully before sharing personal information online. Not every 
website or person needs access to your private details.

7. Keep Backups

Important school projects, documents and other files should be backed up 
regularly.

A backup can help you recover important information if your device develops 
a problem.

Cybersecurity does not have to be complicated. Small habits practiced 
consistently can make a significant difference.
`
        },


        "technology-farmers": {
            category: "ENVIRONMENT",
            title: "How Technology Can Help Farmers",
            date: "2026",
            content: `
Technology is becoming increasingly useful in agriculture. Farmers can use 
sensors, mobile applications, weather information and cloud computing to 
make better decisions.

One example is soil moisture monitoring.

A soil moisture sensor can measure the amount of water available in soil. 
The information can then be processed and displayed through a digital 
system.

This can help farmers understand when crops may need water instead of 
depending entirely on guesswork.

Weather information can also help farmers plan agricultural activities. 
Information about rainfall and temperature can support decisions about 
planting, irrigation and crop management.

Cloud computing can make agricultural data accessible from different 
locations. Sensors in a farm could collect information while a cloud 
platform stores and processes that information.

Mobile applications can then provide useful information to farmers through 
their phones.

Technology can also help monitor crops, manage resources and improve 
communication between farmers and agricultural organizations.

For communities where agriculture is an important part of the economy, 
combining farming knowledge with appropriate technology can create new 
opportunities.

The goal is not to replace farmers. Technology should provide useful 
information that helps farmers make better decisions.
`
        },


        "ai-explained": {
            category: "AI",
            title: "Artificial Intelligence Explained",
            date: "2026",
            content: `
Artificial Intelligence, commonly called AI, is a field of technology 
focused on creating computer systems that can perform tasks that normally 
require human intelligence.

These tasks can include recognizing patterns, understanding language, 
making predictions and analyzing information.

One important area of AI is machine learning.

Machine learning allows computer systems to learn patterns from data. 
Instead of programming every possible situation manually, developers can 
create systems that learn from examples.

AI is already used in many areas of everyday life.

For example, recommendation systems can suggest videos, music or products. 
Navigation applications can analyze information to help people plan routes. 
Some applications can recognize speech or images.

AI can also support education, healthcare, agriculture, business and 
scientific research.

However, AI systems must be used responsibly. The quality of an AI system 
depends partly on the data and methods used to develop it.

People should also verify important information rather than automatically 
assuming that an AI-generated answer is correct.

Learning the fundamentals of AI can help students understand one of the 
important technological developments shaping the modern world.
`
        },


        "cloud-business": {
            category: "CLOUD",
            title: "Why Businesses Are Moving to the Cloud",
            date: "2026",
            content: `
Cloud computing allows businesses to access computing resources over the 
internet instead of depending entirely on physical infrastructure located 
inside their own offices.

One major advantage is scalability.

A business can increase or decrease computing resources depending on its 
needs. This can be useful when an application experiences changes in 
traffic.

Cloud platforms can also provide storage, databases, networking, security 
services and computing resources.

Another benefit is accessibility. Authorized users can access cloud-based 
systems from different locations, depending on the service and its security 
configuration.

Cloud computing can also help businesses experiment with new technologies 
without having to purchase all the physical infrastructure themselves.

However, using the cloud still requires responsible management.

Businesses need to protect accounts, configure permissions correctly, 
monitor resources and understand their cloud costs.

Cloud computing is therefore not simply about moving everything to the 
internet. It is about using computing resources in a way that supports the 
organization's technical and business needs.
`
        },


        "africa-tech": {
            category: "AFRICA AND TECH",
            title: "The Future of Technology in Africa",
            date: "2026",
            content: `
Technology has the potential to support education, agriculture, healthcare, 
business and communication across African communities.

One important area is digital education.

Internet access and digital learning platforms can give students access to 
educational resources beyond their immediate communities.

Technology can also support agriculture. Sensors, mobile applications, 
weather information and cloud platforms can provide useful information for 
farmers.

Financial technology is another important area. Digital payment systems 
can make it easier for people and businesses to access certain financial 
services.

Renewable energy and technology can also work together. Solar energy 
systems combined with sensors and monitoring platforms can provide useful 
information about energy production and usage.

Cloud computing is creating opportunities for African developers and 
businesses to build applications without needing to operate all of their 
own physical infrastructure.

Young developers, engineers, researchers and entrepreneurs can play an 
important role by creating solutions for problems in their own communities.

The future of technology in Africa will not only depend on adopting 
technology created elsewhere. Local knowledge and local innovation can 
also help create solutions designed for African communities.
`
        }

    };


    // FIRST CHECK BUILT-IN ARTICLES

    let post =
        builtInPosts[postId];


    // IF NOT BUILT-IN, CHECK USER-CREATED ARTICLES

    if (!post) {

        const savedPosts =
            JSON.parse(
                localStorage.getItem("devBlogPosts")
            ) || [];


        post =
            savedPosts.find(function (item) {

                return String(item.id) ===
                       String(postId);

            });

    }


    // DISPLAY ARTICLE

    if (post) {

        document.getElementById("postCategory").textContent =
            post.category;

        document.getElementById("postTitle").textContent =
            post.title;

        document.getElementById("postDate").textContent =
            "Published: " + post.date;


        document.getElementById("postContent").textContent =
            post.content;


        // DELETE BUTTONS ARE ONLY FOR USER-CREATED ARTICLES
        // Built-in articles cannot be deleted.

        if (post.authorId) {

            const currentUser =
                getCurrentUser();


            if (currentUser) {

                const ownsPost =
                    String(post.authorId) ===
                    String(currentUser.id);


                const admin =
                    isAdmin();


                // Allow owner OR admin

                if (ownsPost || admin) {

                    const deleteButton =
                        document.createElement("button");


                    deleteButton.textContent =
                        "Delete Article";


                    deleteButton.className =
                        "delete-post-btn";


                    deleteButton.addEventListener(
                        "click",
                        function () {

                            deletePost(post.id);

                        }
                    );


                    singlePost.appendChild(
                        deleteButton
                    );

                }

            }

        }

    }

    else {

        document.getElementById("postTitle").textContent =
            "Post Not Found";


        document.getElementById("postContent").textContent =
            "Sorry, this article could not be found.";

    }

}

//CONTACT FORM

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        // Stop the page from refreshing
        event.preventDefault();

        // Get the message area
        const contactMessage =
            document.getElementById("contactMessage");

        // Display confirmation
        contactMessage.textContent =
            "Thank you! Your message has been received.";

        // Clear the form
        contactForm.reset();

    });

}
//Mobile Navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle && navLinks){
    menuToggle.addEventListener("click", function(){
        navLinks.classList.toggle("active")
    });
}

// BLOG SEARCH

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const noResults =
    document.getElementById("noResults");

if (searchInput && searchButton) {

    searchButton.addEventListener("click", function () {

        const searchTerm =
            searchInput.value.toLowerCase().trim();

        const cards =
            document.querySelectorAll(".blog-card");

        let found = false;

        cards.forEach(function (card) {

            const text =
                card.textContent.toLowerCase();

            if (text.includes(searchTerm)) {

                card.style.display = "block";
                found = true;

            } else {

                card.style.display = "none";

            }

        });

        if (noResults) {

            if (found) {
                noResults.style.display = "none";
            } else {
                noResults.style.display = "block";
            }

        }

    });

}

// USER REGISTRATION

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        // Stop page from refreshing
        event.preventDefault();


        // Get information from the form
        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim().toLowerCase();

        const password =
            document.getElementById("registerPassword").value;


        // Get existing users
        const users =
            JSON.parse(localStorage.getItem("devBlogUsers")) || [];


        // Check if email already exists
        const existingUser =
            users.find(function (user) {

                return user.email === email;

            });


        if (existingUser) {

            alert("An account with this email already exists.");

            return;

        }


        // Create new user
        const newUser = {

            id: Date.now(),

            name: name,

            email: email,

            password: password

        };


        // Save user
        users.push(newUser);

        localStorage.setItem(
            "devBlogUsers",
            JSON.stringify(users)
        );


        // Success message
        alert("Account created successfully!");


        // Clear form
        registerForm.reset();


        // Go to login page
        window.location.href = "login.html";

    });

}


// DEV BLOG LOGIN SYSTEM

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value;

        // Get registered users
        const users =
            JSON.parse(localStorage.getItem("devBlogUsers")) || [];

        // Find matching account
        const user = users.find(function(account) {

            return (
                String(account.email).trim().toLowerCase() === email &&
                String(account.password) === password
            );

        });

        if (!user) {

            alert("Incorrect email or password.");

            return;
        }

        // Save logged-in user
        localStorage.setItem(
            "devBlogCurrentUser",
            JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email
            })
        );

        alert("Login successful! Welcome, " + user.name + "!");

        window.location.href = "blog.html";

    });

}
