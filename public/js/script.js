document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      searchInput.focus();
    });
  }

  searchClose.addEventListener("click", function () {
    searchBar.style.visibility = "hidden";
    searchBar.classList.remove("open");
    this.setAttribute("aria-expanded", "false");
  });
});

// Paystack Payment Handler
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/paystack-key")
    .then((response) => response.json())
    .then((data) => {
      const paystackPublicKey = data.key;

      console.log(paystackPublicKey);

      const modal = document.getElementById("payModal");
      const btn = document.getElementById("buyCoffeeButton");
      const span = document.getElementsByClassName("paystack-close")[0];
      const form = document.getElementById("payForm");

      // Open the modal
      btn.onclick = function () {
        modal.style.display = "block";
      };

      // Close the modal
      span.onclick = function () {
        modal.style.display = "none";
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };

      // Handle form submission
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const amount = document.getElementById("amount").value * 100;

        const handler = PaystackPop.setup({
          key: paystackPublicKey,
          email: email,
          amount: amount,
          currency: "NGN",
          callback: function (response) {
            let reference = response.reference;
            alert(
              `Payment successful! Thank You.\nReference code: ${reference}`
            );
            form.reset();
          },
          onClose: function () {
            alert("Transaction was not completed, window closed.");
          },
        });

        handler.openIframe();
      });
    })
    .catch((error) => {
      console.error("Error fetching Paystack key:", error);
      alert("Failed to initialize payment. Please try again later.");
    });
});
