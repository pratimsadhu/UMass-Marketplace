const db = new PouchDB("users");
/**
 * Function to toggle between sections and render goods/services.
 * @param {string} page - The ID of the section to navigate to.
 */
function navigate(page) {
    const sections = document.querySelectorAll(".content");
    sections.forEach((section) => {
        section.style.display = "none";
    });
    document.getElementById(page).style.display = "block";
    if (page === "products" || page === "services") {
        renderGoods(page);
    }
}

function isAuthenticated(){
  return localStorage.getItem("token") !== null;
}

/**
 * Function to switch to the signup section.
 */
function switchToSignup() {
    document.getElementById("login").style.display = "none";
    document.getElementById("signup").style.display = "block";
}

/**
 * Function to switch to the login section.
 */
function switchToLogin() {
    document.getElementById("signup").style.display = "none";
    document.getElementById("login").style.display = "block";
}

/**
 * Function to print empowering text and reveal hidden elements after typing animation.
 */
function printEmpowering() {
    const empoweringText = document.getElementById("empowering-text");
    const text = "Empowering UMass students one minute at a time";
    let index = 0;

    function typeText() {
        if (index < text.length) {
            empoweringText.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeText, 30); // Adjust the delay here (in milliseconds)
        }
    }

    // Start typing animation
    typeText();

    // After typing animation is completed, show the hidden elements
    document.addEventListener("DOMContentLoaded", function () {
        const welcomeHeader = document.querySelector(".text-4xl");
        const links = document.querySelector(".button-group");

        // Wait for typing animation to complete before showing hidden elements
        setTimeout(
            function () {
                welcomeHeader.classList.remove("opacity-0");
                links.style.opacity = 1;
            },
            text.length * 30 + 400
        ); // Adjust the delay accordingly
    });
}
printEmpowering();

/**
 * Function to get goods data.
 * @returns {Array} An array containing goods data.
 */
async function fetchProducts() {
    try {
        const response = await fetch("/products");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
}
async function fetchServices() {
    try {
        const response = await fetch("/services");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
}

/**
 * Function to render goods or services.
 * @param {string} prodServ - Indicates whether to render goods or services.
 */
function renderGoods(prodServ) {
    let productsContainer;
    const cardClass = prodServ === "services" ? "service-card" : "product-card";
    // Determine which container and card class to use based on input
    if (prodServ === "services") {
        productsContainer = document.querySelector(".services-container");
        fetchServices().then((data) => {
            console.log(data);
            helper(data, productsContainer, cardClass)

        });
    } else {
        productsContainer = document.querySelector(".products-container");
        fetchProducts().then((data) => {helper(data, productsContainer,cardClass)});
    }
}

    // Clear existing content in the container
function helper(products, productsContainer, cardClass) {
        productsContainer.innerHTML = "";
        // Loop through products and create cards
        products.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add(cardClass);

            const img = document.createElement("img");
            img.src = product.imageSrc;
            img.alt = product.alt;

            const hr = document.createElement("hr");

            const descContainer = document.createElement("div");
            descContainer.classList.add("desc-container");

            const nameElement = document.createElement("div");
            nameElement.classList.add(
                cardClass === "product-card" ? "productname" : "companyname"
            );
            nameElement.textContent = product.name;

            const extraInfo = document.createElement("div");
            extraInfo.classList.add(
                cardClass === "product-card" ? "price" : "rating"
            );
            extraInfo.textContent =`Price: ${product.price}`
            extraInfo.style.fontSize = "16px";
            extraInfo.style.color =
                cardClass === "product-card" ? "#883202" : "#000"; // Adjust color based on card type

            // Append elements to their respective parents
            descContainer.appendChild(nameElement);
            descContainer.appendChild(extraInfo);
            productCard.appendChild(img);
            productCard.appendChild(hr);
            productCard.appendChild(descContainer);

            productsContainer.appendChild(productCard);
        });
    }

/**
 * Function to check if the username exists in the database.
 * @param {string} username - The username to check.
 * @returns {Object|null} The user object if found, otherwise null.
 */
async function checkUsername(username) {
    try {
        const response = await db.get(username);
        return response;
    } catch (error) {
        if (error.status === 404) {
            return null; // Username not found
        } else {
            throw error; // Other error
        }
    }
}

/**
 * Function to handle user login.
 */
function loginScript() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => {
        if (response.ok) {
            alert("Login successful");
            localStorage.setItem("token", "your_token_here");
            // Redirect or perform actions after successful login
        } else {
            throw new Error("Invalid username or password");
        }
    })
    .catch((error) => {
        console.error("Login Error:", error);
        alert("Invalid username or password");
    });
}


/**
 * Function to handle user signup.
 */
function signupScript() {
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
    })
    .then((response) => {
        if (response.ok) {
            alert("Signup successful");
            // Redirect or perform actions after successful signup
        } else {
            throw new Error("Username already exists or other error");
        }
    })
    .catch((error) => {
        console.error("Signup Error:", error);
        alert("Username already exists or other error occurred");
    });
}


const goods = [
    {
        name: "I-Clicker",
        imageSrc: "./Images/iclicker.jpg",
        alt: "Service 1",
        price: "26$",
    },
    {
        name: "Table Lamp",
        imageSrc: "./Images/tablelamp.jpg",
        alt: "Service 2",
        price: "22$",
    },
    {
        name: "Book Shelf",
        imageSrc: "./Images/bookshelf.jpg",
        alt: "Service 3",
        price: "87$",
    },
];
const services = [
    {
        name: "Craig's Barbershop",
        imageSrc: "./Images/Service1.png",
        alt: "Service 1",
        rating: "4.5",
        numOfReviews: 587,
    },
    {
        name: "Josh Bell Photography",
        imageSrc: "./Images/photography.jpg",
        alt: "Service 2",
        rating: "4.92",
        numOfReviews: 53,
    },
    {
        name: "CampusEdge Personal Training",
        imageSrc: "./Images/gym.jpg",
        alt: "Service 3",
        rating: "4.21",
        numOfReviews: 23,
    },
];

document
    .getElementById("contactForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const formData = {
            name: name,
            email: email,
            message: message,
        };

        fetch("/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("contactForm").reset();
                navigate("home");
                showNotification(data.message);
            })
            .catch((error) => {
                console.error("Error:", error);
                showNotification(
                    "An error occurred while sending the email",
                    2000
                );
            });
    });

document
    .getElementById("listingForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        let type = document.getElementById("listingType").value;
        let item;

        if (!isAuthenticated()) {
          showNotification("Please log in to add a listing.");
          navigate("login");
          return;
        }

        async function encodeImages(files) {
            const images = [];
            for (let i = 0; i < files.length; i++) {
                const imagePromise = new Promise((resolve, reject) => {
                    getBase64(files[i], resolve);
                });
                images.push(imagePromise);
            }
            return Promise.all(images);
        }

        if (type === "product" || type === "service") {
            let name = document.getElementById(type + "Name").value;
            let email = document.getElementById(type + "Email").value;
            let phone = document.getElementById(type + "Phone").value;
            let price =
                type === "product"
                    ? document.getElementById("productPrice").value
                    : undefined;
            let files = document.getElementById(type + "Image").files;

            const images = await encodeImages(files);

            item = {
                type: type,
                name: name,
                email: email,
                phoneNo: phone,
                price: price,
                images: images,
            };
        }

        fetch("/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("listingForm").reset();
                navigate("home");
                showNotification(`${item.name} listed successfully`);
            })
            .catch((error) => {
                console.error("Error: ", error);
                showNotification("An error occurred while listing the item");
            });
    });

function showNotification(message, duration = 3000) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => {
            notification.classList.remove("show", "hide");
            notification.style.opacity = "";
            notification.style.top = "";
        }, 500);
    }, duration);
}

function isValidBase64(str) {
    const regex =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return regex.test(str);
}

function getBase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        const base64String = reader.result.replace(/^data:.+;base64,/, "");
        callback(base64String);
    };
    reader.onerror = function (error) {
        console.log("Error: ", error);
    };
}
