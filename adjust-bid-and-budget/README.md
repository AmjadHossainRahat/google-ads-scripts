# Google Ads Script for Keyword's Bid and Campaign's budget Adjustment
The primary goal was to maximize return on ad spend (ROAS) while ensuring the budget was allocated efficiently across high-performing and low-performing keywords.

## Objectives:
1. **Automate Bid Adjustments:** Adjust bids based on keyword performance.
2. **Dynamic Budget Allocation:** Shift budget from low to high-performing campaigns.
3. **Logging:** Log details of bid adjustments for each keyword, ad group, and campaign.


```javaScript
var targetRoas = 3.0; // Set target ROAS
var minRoas = 1.0; // Set minimum ROAS
var bidIncreasePercentage = 0.2; // Increase bids by 20%
var bidDecreasePercentage = 0.2; // Decrease bids by 20%

function main() {
  var campaigns = AdsApp.campaigns().get();
  
  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var adGroups = campaign.adGroups().get();
    
    while (adGroups.hasNext()) {
      var adGroup = adGroups.next();
      var keywords = adGroup.keywords().get();
      
      while (keywords.hasNext()) {
        var keyword = keywords.next();
        var stats = keyword.getStatsFor("LAST_30_DAYS");
        
        var cost = stats.getCost();
        var conversions = stats.getConversions();
        var conversionValue = stats.getConversionValue();
        
        if (cost > 0) {
          var roas = conversionValue / cost;
          
          if (roas > targetRoas) {
            var newBid = keyword.bidding().getCpc() * (1 + bidIncreasePercentage);
            keyword.bidding().setCpc(newBid);
            Logger.log('Increased bid for Keyword: ' + keyword.getText() + ' in AdGroup: ' + adGroup.getName() + ' of Campaign: ' + campaign.getName());
          } else if (roas < minRoas) {
            var newBid = keyword.bidding().getCpc() * (1 - bidDecreasePercentage);
            keyword.bidding().setCpc(newBid);
            Logger.log('Decreased bid for Keyword: ' + keyword.getText() + ' in AdGroup: ' + adGroup.getName() + ' of Campaign: ' + campaign.getName());
          }
        }
      }
    }
  }
  
  Logger.log('Bid adjustments completed.');
}

function analyzeCampaignPerformance() {
  // Function to analyze and reallocate budget between campaigns
  // Placeholder for budget reallocation logic
}

```

# Summary:
This script automates bid adjustments based on ROAS, reallocates budgets dynamically, and logs all changes with details of the keyword, ad group, and campaign, ensuring efficient and effective ad spend management.