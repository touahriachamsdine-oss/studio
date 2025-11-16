
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, PlusCircle, ListChecks, Users as UsersIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for existing plans
const mockPlans = [
  { id: 'plan1', name: 'Basic', price: '9.99', duration: 30, features: 'Feature A, Feature B' },
  { id: 'plan2', name: 'Pro', price: '29.99', duration: 30, features: 'Feature A, B, C, D' },
  { id: 'plan3', name: 'Annual Basic', price: '99.99', duration: 365, features: 'Feature A, Feature B, Discount' },
];

// Mock data for user subscriptions
const mockUserSubscriptions = [
  { id: 'sub1', userName: 'John Doe', userEmail: 'john@example.com', currentPlan: 'Pro', expiryDate: '2024-12-31' },
  { id: 'sub2', userName: 'Jane Smith', userEmail: 'jane@example.com', currentPlan: 'Basic', expiryDate: '2024-08-15' },
];


export default async function AdminSubscriptionsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);
  const adminDict = dictionary.admin;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {adminDict.editSubscriptions}
          </CardTitle>
          <CardDescription>
            {adminDict.subscriptionsPageDescription}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Create New Subscription Plan Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            {adminDict.createNewSubscriptionPlanTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="planName">{adminDict.planNameLabel}</Label>
              <Input id="planName" placeholder={adminDict.planNameLabel} />
            </div>
            <div>
              <Label htmlFor="planPrice">{adminDict.planPriceLabel}</Label>
              <Input id="planPrice" type="number" placeholder="9.99" />
            </div>
          </div>
          <div>
            <Label htmlFor="planDuration">{adminDict.planDurationLabel}</Label>
            <Input id="planDuration" type="number" placeholder="30" />
          </div>
          <div>
            <Label htmlFor="planFeatures">{adminDict.planFeaturesLabel}</Label>
            <Textarea id="planFeatures" placeholder={adminDict.planFeaturesLabel} />
          </div>
          <Button disabled>{adminDict.createPlanButton}</Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Existing Subscription Plans Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            {adminDict.existingSubscriptionPlansTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockPlans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{adminDict.planNameLabel}</TableHead>
                  <TableHead>{adminDict.priceColumn}</TableHead>
                  <TableHead>{adminDict.durationColumn}</TableHead>
                  <TableHead>{adminDict.featuresColumn}</TableHead>
                  <TableHead className="text-right">{adminDict.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>${plan.price}</TableCell>
                    <TableCell>{plan.duration}</TableCell>
                    <TableCell className="truncate max-w-xs">{plan.features}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" disabled>{adminDict.editButton}</Button>
                      <Button variant="destructive" size="sm" disabled>{adminDict.deleteButton}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">{adminDict.noPlansAvailable}</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* User Subscription Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            {adminDict.userSubscriptionManagementTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input placeholder={adminDict.searchUserByEmailLabel} className="max-w-sm" />
            <Button disabled>{adminDict.searchButton}</Button>
          </div>
          {mockUserSubscriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{adminDict.userNameColumn}</TableHead>
                  <TableHead>{dictionary.form.email}</TableHead>
                  <TableHead>{adminDict.currentPlanColumn}</TableHead>
                  <TableHead>{adminDict.expiryDateColumn}</TableHead>
                  <TableHead className="text-right">{adminDict.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUserSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.userName}</TableCell>
                    <TableCell>{sub.userEmail}</TableCell>
                    <TableCell>{sub.currentPlan}</TableCell>
                    <TableCell>{sub.expiryDate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>{adminDict.manageSubscriptionButton}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">{adminDict.noUserSubscriptionsFound}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    