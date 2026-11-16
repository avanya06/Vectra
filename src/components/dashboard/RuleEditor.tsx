import { useState, useEffect } from 'react';
import { Rule } from '@/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Clock, Globe, Zap } from 'lucide-react';

interface RuleEditorProps {
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
}

const RuleEditor = ({ rules, onChange }: RuleEditorProps) => {
  const findRule = (type: string, condition?: string) => {
    return rules.find(r => r.type === type && (!condition || r.condition === condition));
  };

  const handleRuleChange = (type: 'time' | 'device' | 'location' | 'performance', condition: string, checked: boolean, action: 'boost' | 'hide' | 'pin' = 'boost', weight: number = 50) => {
    let newRules = [...rules];
    
    if (checked) {
      const existingIndex = newRules.findIndex(r => r.type === type && r.condition === condition);
      const rule: Rule = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        condition,
        action,
        weight
      };
      
      if (existingIndex >= 0) {
        newRules[existingIndex] = rule;
      } else {
        newRules.push(rule);
      }
    } else {
      newRules = newRules.filter(r => !(r.type === type && r.condition === condition));
    }
    
    onChange(newRules);
  };

  return (
    <div className="space-y-6 p-5 bg-card/40 rounded-xl border border-border/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg flex items-center gap-2 text-foreground">
          <Zap className="w-5 h-5 text-primary" />
          Smart Rules
        </h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
          {rules.length} active
        </span>
      </div>

      <Tabs defaultValue="device" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-card/40 border border-border/5 p-1 h-auto">
          <TabsTrigger value="device" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black"><Smartphone className="w-4 h-4" /> Device</TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black"><Clock className="w-4 h-4" /> Time</TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black"><Globe className="w-4 h-4" /> Location</TabsTrigger>
        </TabsList>

        <TabsContent value="device" className="space-y-4 pt-4">
          <div className="space-y-4">
            {['mobile', 'desktop'].map((device) => {
              const rule = findRule('device', device);
              return (
                <div key={device} className="flex flex-col gap-4 p-4 bg-card/20 rounded-xl border border-border/5 hover:border-border/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <Label className="capitalize font-medium text-base text-gray-100">{device} Users</Label>
                    <Switch 
                      checked={!!rule}
                      onCheckedChange={(c) => handleRuleChange('device', device, c)}
                    />
                  </div>
                  
                  {rule && (
                    <div className="space-y-4 pl-3 border-l-2 border-primary/30 pt-1">
                      <div className="flex items-center gap-4">
                        <Label className="text-sm font-medium text-muted-foreground w-20">Action</Label>
                        <Select 
                          value={rule.action} 
                          onValueChange={(v: any) => handleRuleChange('device', device, true, v, rule.weight)}
                        >
                          <SelectTrigger className="h-9 bg-card/40 border-border/10 text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="boost">Boost Priority</SelectItem>
                            <SelectItem value="hide">Hide Link</SelectItem>
                            <SelectItem value="pin">Pin to Top</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {rule.action === 'boost' && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Boost Strength</span>
                            <span className="font-mono text-primary">{rule.weight}%</span>
                          </div>
                          <Slider 
                            value={[rule.weight]} 
                            max={100} 
                            step={10}
                            className="py-2"
                            onValueChange={([v]) => handleRuleChange('device', device, true, rule.action, v)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="time" className="space-y-4 pt-4">
           {['morning', 'afternoon', 'evening', 'night'].map((time) => {
              const rule = findRule('time', time);
              return (
                <div key={time} className="flex flex-col gap-4 p-4 bg-card/20 rounded-xl border border-border/5 hover:border-border/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <Label className="capitalize font-medium text-base text-gray-100">{time}</Label>
                    <Switch 
                      checked={!!rule}
                      onCheckedChange={(c) => handleRuleChange('time', time, c)}
                    />
                  </div>
                  {rule && (
                     <div className="space-y-4 pl-3 border-l-2 border-primary/30 pt-1">
                        <div className="flex items-center gap-4">
                        <Label className="text-sm font-medium text-muted-foreground w-20">Action</Label>
                        <Select 
                          value={rule.action} 
                          onValueChange={(v: any) => handleRuleChange('time', time, true, v, rule.weight)}
                        >
                          <SelectTrigger className="h-9 bg-card/40 border-border/10 text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="boost">Boost</SelectItem>
                            <SelectItem value="hide">Hide</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                     </div>
                  )}
                </div>
              );
           })}
        </TabsContent>

        <TabsContent value="location" className="space-y-4 pt-4">
          <div className="p-4 bg-card/20 rounded-xl border border-border/5">
             <Label className="mb-3 block text-base text-gray-100">Target Region</Label>
             <Select 
               value={findRule('location')?.condition || ''} 
               onValueChange={(v) => {
                 if (v) handleRuleChange('location', v, true);
               }}
             >
              <SelectTrigger className="bg-card/40 border-border/10 text-foreground h-10">
                <SelectValue placeholder="Select region to target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
            {findRule('location') && (
              <div className="mt-4 text-sm text-primary flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Globe className="w-4 h-4" /> 
                <span className="font-medium">Active: <span className="uppercase">{findRule('location')?.condition}</span></span>
                <button 
                  onClick={() => {
                     const r = findRule('location');
                     if(r) handleRuleChange('location', r.condition, false);
                  }}
                  className="ml-auto text-red-400 hover:text-red-300 hover:underline text-xs"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RuleEditor;