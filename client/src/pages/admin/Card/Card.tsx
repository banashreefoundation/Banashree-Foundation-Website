import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
  } from "@/components/ui/card";
  
  const Cards = () => {
    // Sample counts for demonstration
    const counts = {
      users: 150,
      orders: 75,
      revenue: "$5,000",
      feedback: 120,
    };
  
    return (
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="max-w-xs">
            <CardContent className="flex items-center justify-center h-full p-4">
                <div className="flex items-center space-x-4">
                <img src="../../src/assets/images/programs.png" alt="icon" className="w-12 h-12" />
                <div className="flex flex-col items-start space-y-2">
                    <CardTitle style={{ color: '#BE6458' }}>#Programs</CardTitle>
                    <CardDescription className="font-bold text-black">{counts.users}</CardDescription>
                    <img src="../../src/assets/images/arrow.png" alt="icon" className="w-8 h-4 mt-2" />
                </div>
                </div>
            </CardContent>
            </Card>

            <Card className="max-w-xs">
            <CardContent className="flex items-center justify-center h-full p-4">
            <div className="flex items-center space-x-4">
                <img src="../../src/assets/images/projects.png" alt="icon" className="w-12 h-12" />
                <div className="flex flex-col items-start sspace-y-2">
                <CardTitle style={{ color: '#BE6458' }}>#Projects</CardTitle>
                <CardDescription className="font-bold text-black">{counts.orders}</CardDescription>
                <img src="../../src/assets/images/arrow.png" alt="icon" className="w-8 h-4 mt-2" />
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="max-w-xs">
            <CardContent className="flex items-center justify-center h-full p-4">
            <div className="flex items-center space-x-4">
                <img src="../../src/assets/images/campaigns.png" alt="icon" className="w-12 h-12" />
                <div className="flex flex-col items-start space-y-2">
                <CardTitle style={{ color: '#BE6458' }}>#Campaigns</CardTitle>
                <CardDescription className="font-bold text-black">{counts.feedback}</CardDescription>
                <img src="../../src/assets/images/arrow.png" alt="icon" className="w-8 h-4 mt-2" />
                </div>
                </div>
            </CardContent>
            </Card>

            <Card className="max-w-xs">
            <CardContent className="flex items-center justify-center h-full p-4">
            <div className="flex items-center space-x-4">
                <img src="../../src/assets/images/volunteer.png" alt="icon" className="w-12 h-12" />
                <div className="flex flex-col items-start space-y-2">
                <CardTitle style={{ color: '#BE6458' }}>#Volunteers</CardTitle>
                <CardDescription className="font-bold text-black">{counts.revenue}</CardDescription>
                <img src="../../src/assets/images/arrow.png" alt="icon" className="w-8 h-4 mt-2" />
                </div>
                </div>
            </CardContent>
            </Card>
      </div>
  );
  
  };
  
  export default Cards;
  