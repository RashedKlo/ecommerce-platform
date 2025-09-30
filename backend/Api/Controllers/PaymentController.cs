using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using DataAccess.DTOS.OrderDetails;

[ApiController]
[Route("Api/Payment")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class PaymentController : ControllerBase
{
    private readonly string _stripeSecretKey;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(IConfiguration configuration, ILogger<PaymentController> logger)
    {
        _stripeSecretKey = configuration["Stripe:SecretKey"]!;
        _logger = logger;

        // Set Stripe API key
        StripeConfiguration.ApiKey = _stripeSecretKey;


    }

    [HttpPost("Create")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] List<OrderDetailDTO> order)
    {
        try
        {
            // Validate input
            if (order == null || !order.Any())
            {
                return BadRequest("Order cannot be null or empty");
            }

            var currentUserID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserID))
            {
                return Unauthorized("User ID not found in token");
            }

            // Validate order items
            foreach (var item in order)
            {
                if (string.IsNullOrEmpty(item.ProductName))
                {
                    return BadRequest("Product name cannot be empty");
                }
                if (item.UnitPrice <= 0)
                {
                    return BadRequest("Unit price must be greater than 0");
                }
                if (item.Quantity <= 0)
                {
                    return BadRequest("Quantity must be greater than 0");
                }
            }

            _logger.LogInformation($"Creating Stripe checkout session for user: {currentUserID}");

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" }, // Simplified - add "link" back if needed
                Mode = "payment",
                SuccessUrl = $"http://localhost:5173/success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = "http://localhost:5173/cancel",
                LineItems = order.Select(item => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.ProductName
                        },
                        UnitAmount = (long)(item.UnitPrice * 100) // Convert to cents
                    },
                    Quantity = item.Quantity
                }).ToList(),
                Metadata = new Dictionary<string, string>
                {
                    { "userId", currentUserID }
                },
                // Add these for better session management
                ExpiresAt = DateTime.UtcNow.AddMinutes(30), // Session expires in 30 minutes
                PaymentIntentData = new SessionPaymentIntentDataOptions
                {
                    Metadata = new Dictionary<string, string>
                    {
                        { "userId", currentUserID },
                        { "orderItems", order.Count.ToString() }
                    }
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            _logger.LogInformation($"Stripe session created successfully: {session.Id}");

            return Ok(new
            {
                sessionId = session.Id,
                url = session.Url // Include the checkout URL
            });
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, $"Stripe error: {ex.Message}");
            return StatusCode(500, new
            {
                error = "Payment processing error",
                details = ex.Message,
                stripeErrorCode = ex.StripeError?.Code
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Unexpected error in CreateCheckoutSession: {ex.Message}");
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }
}