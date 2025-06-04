<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $dbname = 'vacation_saathi';

    $conn = new mysqli($host, $user, $pass, $dbname);
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    // Get values safely
    $name = $_POST['name'] ?? null;
    $email = $_POST['email'] ?? null;
    $phone = $_POST['phone'] ?? null;
    $password = $_POST['password'] ?? null;
    $confirm_password = $_POST['confirm_password'] ?? null;

    // Validate fields
    if (!$name || !$email || !$phone || !$password || !$confirm_password) {
        die("All fields are required.");
    }

    if ($password !== $confirm_password) {
        die("Passwords do not match.");
    }

    // Check if email already exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        die("Email already registered.");
    }

    // Insert new user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $phone, $hashedPassword);

    if ($stmt->execute()) {
        header("Location: login.php");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }

    $conn->close();
}
?>



<!-- Include the same HTML layout as the image with Register form active -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register - Vacation Saathi</title>
  <link rel="stylesheet" href="Travel.css">
</head>
<body>
  <div class="container">
    <div class="left">
      <h1>Welcome to Vacation<br>Saathi</h1>
      <ul>
        <li>✈️ Create your free account today and unlock the full journey experience!</li>
        <li>✓ Report your lost travel essentials quickly and easily</li>
        <li>✓ Get instant alerts when someone finds your belongings</li>
        <li>✓ Chat securely with finders and reunite faster</li>
        <li>✓ Keep track of your lost and found travel history</li>
        <li>✓ Join a global community of travelers helping travelers</li>
      </ul>
    </div>

    <div class="right">
      <h2>Register</h2>
      <form method="POST" action="register.php">
        <label>Full Name</label>
        <input type="text" name="name" required>

        <label>Email Address</label>
        <input type="email" name="email" required>

        <label>Phone Number</label>
        <input type="tel" name="phone" required>

        <label>Password</label>
        <input type="password" name="password" required>

        <label>Confirm Password</label>
        <input type="password" name="confirm_password" required>
                           <div class="form-group-checkbox">
                            <input type="checkbox" id="termsAndConditions" required>
                            <label for="termsAndConditions">I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></label>
                        </div>

        <button type="submit">Register</button>
        <p style="margin-top: 20px;">Already have an account? <a href="login.php">Login here</a></p>
      </form>
    </div>
  </div>
</body>
</html>