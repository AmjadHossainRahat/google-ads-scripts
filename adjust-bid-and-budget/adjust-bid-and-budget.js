var targetRoas = 3.0; // Set target ROAS
var minRoas = 1.0; // Set minimum ROAS
var bidIncreasePercentage = 0.2; // Increase bids by 20%
var bidDecreasePercentage = 0.2; // Decrease bids by 20%
var budgetIncreasePercentage = 0.1; // Increase budget by 10%
var budgetDecreasePercentage = 0.1; // Decrease budget by 10%

function main() {
  adjustBids();
  Logger.log('Bid and budget adjustments completed.');
}

function adjustBids() {
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
    
    // Adjust the budget for the current campaign
    adjustCampaignBudget(campaign);
  }
}

function adjustCampaignBudget(campaign) {
  var stats = campaign.getStatsFor("LAST_30_DAYS");
  
  var cost = stats.getCost();
  var conversions = stats.getConversions();
  var conversionValue = stats.getConversionValue();
  
  if (cost > 0) {
    var roas = conversionValue / cost;
    
    if (roas > targetRoas) {
      var newBudget = campaign.getBudget().getAmount() * (1 + budgetIncreasePercentage);
      campaign.getBudget().setAmount(newBudget);
      Logger.log('Increased budget for Campaign: ' + campaign.getName());
    } else if (roas < minRoas) {
      var newBudget = campaign.getBudget().getAmount() * (1 - budgetDecreasePercentage);
      campaign.getBudget().setAmount(newBudget);
      Logger.log('Decreased budget for Campaign: ' + campaign.getName());
    }
  }
}
