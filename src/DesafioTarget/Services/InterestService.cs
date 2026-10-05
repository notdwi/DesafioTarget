namespace DesafioTarget.Services;

public class InterestService
{
    private const decimal DailyRate = 0.025m;

    public InterestResult Calculate(decimal originalAmount, DateOnly dueDate)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var lateDays = today.DayNumber - dueDate.DayNumber;

        if (lateDays <= 0)
            return new InterestResult(0m, originalAmount, 0);

        var interest = originalAmount * DailyRate * lateDays;
        return new InterestResult(interest, originalAmount + interest, lateDays);
    }
}

public record InterestResult(decimal Interest, decimal TotalAmount, int LateDays);
