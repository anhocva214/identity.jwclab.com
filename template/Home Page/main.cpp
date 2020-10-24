#include <iostream>
#include <string.h>
#include <fstream>
#include <conio.h>
using namespace std;
int main()
{
   ifstream fin("input.txt");
   string s,c;
   int n,d,i,l,r,vt;
   fin>>n>>s;
   fin>>vt>>c;
   s.insert(vt-1,c);
   if ((s[vt]!=c[0]) and (s[vt-2]!=c[0])) cout<<"dem = "<<"0";
   else
   { l=vt-2;
   r=vt;
       do
       { while (s[l]==c[0]) l--;
         while (s[r]==c[0]) r++;
         if((r-l)>3)
         {
         s=s.erase(l+1,r-l-1);
         l=l;
         r=l+1;
         c[0]=s[r];
         } else break;
       }while (s[l]==s[r]);
       cout<<s<<"\n";
 cout<<"dem moi="<<n+1-s.length();
   }
    return 0;
}