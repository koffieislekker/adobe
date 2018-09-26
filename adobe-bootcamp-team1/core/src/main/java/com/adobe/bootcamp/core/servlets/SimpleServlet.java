/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.adobe.bootcamp.core.servlets;

import com.adobe.acs.commons.adobeio.service.EndpointService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Objects;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service = Servlet.class,
        property = {
                Constants.SERVICE_DESCRIPTION + "=Get profile data from user",
                "sling.servlet.paths=/bin/cmp"})
public class SimpleServlet extends SlingSafeMethodsServlet {

    private static final long serialVersionUID = 1L;

    @Reference(target = "(id=campaign-activites)")
    private EndpointService endpointService;

    @Override
    protected void doGet(final SlingHttpServletRequest request,
                         final SlingHttpServletResponse response) throws IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");

        String customerId = Objects.requireNonNull(request.getRequestParameterMap().getValue("customerId")).getString();
        JsonObject customerProfile = new JsonObject();

        if(endpointService.isConnected()){
            JsonObject result = endpointService.performIO_Action();
            result.getAsJsonArray("content").iterator().forEachRemaining(profile -> {
                if(customerId.equals(profile.getAsJsonObject().get("PKey").getAsString())){
                    JsonObject customerJsonObject = profile.getAsJsonObject();
                    customerProfile.addProperty("customerId", customerJsonObject.get("PKey").getAsString());
                    customerProfile.addProperty("cusChristmasbuyer", customerJsonObject.get("cusChristmasbuyer").getAsBoolean());
                    customerProfile.addProperty("cusCity", customerJsonObject.get("cusCity").getAsString());
                    customerProfile.addProperty("cusCompanyname", customerJsonObject.get("cusCompanyname").getAsString());
                    customerProfile.addProperty("cusCompanytype", customerJsonObject.get("cusCompanytype").getAsString());
                    customerProfile.addProperty("cusEmailadress", customerJsonObject.get("cusEmailadress").getAsString());
                    customerProfile.addProperty("cusName", customerJsonObject.get("cusName").getAsString());
                    customerProfile.addProperty("cusName", customerJsonObject.get("cusNrofemployees").getAsInt());
                }
            });
        }

        Gson gson = new Gson();

        response.getWriter().write(gson.toJson(customerProfile));


    }
}
