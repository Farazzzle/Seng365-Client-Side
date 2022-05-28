export interface AuctionOut {
    auctionId: number;
    title: string;
    categoryId: number;
    endDate: string;
    reserve: number;
    highestBid: number;
    numBids: number;
    sellerId: number;
    sellerFirstName: string;
    sellerLastName: string;
}
